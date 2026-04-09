import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURA TU CONTRASEÑA AQUÍ
const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3307,
  user: 'root',
  password: '', // Sin contraseña en esta instancia especial local
  database: 'safetyscore',
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// -- MOCKS REEMPLAZANDO A SUPABASE AUTH --
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Attempting login for: ${email}`);
    
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado en la base de datos local.' });
    }
    
    const user = rows[0];
    
    // Validación de contraseña (texto plano para facilidad de demo local)
    if (user.password_hash !== password && user.password_hash !== 'dummy_password') {
      return res.status(401).json({ message: 'Contraseña incorrecta. Intenta con "password123".' });
    }
    
    const [profiles] = await pool.query('SELECT * FROM profiles WHERE id = ?', [user.id]);
    const profile = profiles[0] || { role: 'pyme', full_name: 'Usuario Nuevo' };

    const userData = {
      id: user.id,
      email: user.email,
      user_metadata: { 
        role: profile.role,
        full_name: profile.full_name
      }
    };

    console.log(`✅ Login successful for ${email} as ${profile.role}`);

    res.json({
      user: userData,
      session: { 
        access_token: 'MOCK_TOKEN_LOCAL_' + Date.now(),
        user: userData 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error interno del servidor al autenticar.' });
  }
});

// -- PERFILES --
app.get('/api/profiles/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM profiles WHERE id = ?', [req.params.id]);
  res.json(rows[0] || null);
});

app.put('/api/profiles/:id', async (req, res) => {
  try {
    const allowed = ['full_name', 'avatar_url', 'nessie_customer_id', 'nessie_account_id'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    if (!Object.keys(updates).length) return res.status(400).json({ error: 'Sin campos válidos' });
    await pool.query('UPDATE profiles SET ? WHERE id = ?', [updates, req.params.id]);
    const [rows] = await pool.query('SELECT * FROM profiles WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -- NEGOCIOS (PYMES) --
app.get('/api/businesses', async (req, res) => {
  const { owner_id } = req.query;
  const [rows] = await pool.query('SELECT * FROM businesses WHERE owner_id = ?', [owner_id]);
  res.json(rows[0] || null);
});

app.post('/api/businesses', async (req, res) => {
  try {
    const { v4: uuidv4 } = await import('crypto');
    const id = require('crypto').randomUUID();
    const b = req.body;
    await pool.query(
      `INSERT INTO businesses (id, owner_id, name, sector, location_city, location_state,
       years_operating, employees, daily_sales, fixed_costs, variable_costs,
       has_debts, debt_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
      [id, b.owner_id, b.name, b.sector, b.location_city, b.location_state,
       b.years_operating, b.employees, b.daily_sales, b.fixed_costs, b.variable_costs,
       b.has_debts ? 1 : 0, b.debt_amount || 0]
    );
    const [rows] = await pool.query('SELECT * FROM businesses WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/businesses/:id', async (req, res) => {
  try {
    const allowed = ['name','sector','location_city','location_state','years_operating',
      'employees','daily_sales','fixed_costs','variable_costs','has_debts','debt_amount',
      'safety_score','safety_sub_cashflow','safety_sub_sector','safety_sub_consistency',
      'safety_sub_return_probability','trust_layer_analysis','status'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    if (!Object.keys(updates).length) return res.status(400).json({ error: 'Sin campos válidos' });
    await pool.query('UPDATE businesses SET ? WHERE id = ?', [updates, req.params.id]);
    const [rows] = await pool.query('SELECT * FROM businesses WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -- OPORTUNIDADES DEL MARKETPLACE --
app.get('/api/opportunities', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, b.name as biz_name, b.sector as biz_sector,
             b.location_city as biz_city, b.location_state as biz_state,
             b.safety_score as biz_score, b.owner_id as biz_owner_id,
             b.trust_layer_analysis as biz_trust_layer_analysis,
             p.nessie_account_id as biz_nessie_account_id
      FROM opportunities o 
      JOIN businesses b ON o.business_id = b.id 
      LEFT JOIN profiles p ON p.id = b.owner_id
      WHERE o.status = "open"
      ORDER BY o.created_at DESC
    `);
    
    // Anidar en forma de grafos como Supabase
    const result = rows.map(r => {
      const {
        biz_name, biz_sector, biz_city, biz_state, biz_score,
        biz_owner_id, biz_trust_layer_analysis, biz_nessie_account_id, ...opp
      } = r;
      const goalUnitsRemaining = Math.max(0, (Number(opp.goal_total_units) || 0) - (Number(opp.goal_current_units_funded) || 0));
      return { 
        ...opp, 
        goal_units_remaining: goalUnitsRemaining,
        business: {
          id: opp.business_id,
          owner_id: biz_owner_id,
          name: biz_name,
          sector: biz_sector,
          location_city: biz_city,
          location_state: biz_state,
          safety_score: biz_score,
          trust_layer_analysis: biz_trust_layer_analysis,
          nessie_account_id: biz_nessie_account_id
        }
      };
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/marketplace/summary', async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        COUNT(*) AS open_opportunities,
        COALESCE(SUM(requested_amount), 0) AS total_requested_amount,
        COALESCE(SUM(funded_amount), 0) AS total_funded_amount,
        COALESCE(AVG(expected_roi), 0) AS average_roi,
        COALESCE(
          (SUM(CASE WHEN marketplace_status = 'high-demand' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0)) * 100,
          0
        ) AS high_demand_percentage
      FROM opportunities
      WHERE status = 'open'
    `);

    const summary = rows[0] || {};
    res.json({
      openOpportunities: Number(summary.open_opportunities) || 0,
      totalRequestedAmount: Number(summary.total_requested_amount) || 0,
      totalFundedAmount: Number(summary.total_funded_amount) || 0,
      averageROI: Number(summary.average_roi) || 0,
      highDemandPercentage: Number(summary.high_demand_percentage) || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/opportunities/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.json(null);

  const opportunity = rows[0];
  const [biz] = await pool.query('SELECT * FROM businesses WHERE id = ?', [opportunity.business_id]);
  const [invRows] = await pool.query(
    'SELECT COUNT(*) AS investors, COALESCE(SUM(amount), 0) AS total_committed FROM investments WHERE opportunity_id = ?',
    [req.params.id]
  );
  const stats = invRows[0] || { investors: 0, total_committed: 0 };
  const goalUnitsRemaining = Math.max(0, (Number(opportunity.goal_total_units) || 0) - (Number(opportunity.goal_current_units_funded) || 0));
  res.json({
    ...opportunity,
    goal_units_remaining: goalUnitsRemaining,
    investors_count: Number(stats.investors) || 0,
    total_committed: Number(stats.total_committed) || 0,
    business: biz[0]
  });
});

// -- INVERSIONES / PORTAFOLIO --
app.get('/api/investments', async (req, res) => {
  const { investor_id } = req.query;
  const [rows] = await pool.query('SELECT * FROM investments WHERE investor_id = ?', [investor_id]);
  
  const mapped = await Promise.all(rows.map(async (inv) => {
    const [oppRows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [inv.opportunity_id]);
    const opp = oppRows[0] || {};
    const [bizRows] = await pool.query('SELECT * FROM businesses WHERE id = ?', [opp.business_id]);
    return { ...inv, opportunity: { ...opp, business: bizRows[0] } };
  }));
  res.json(mapped);
});

app.post('/api/investments', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { investor_id, opportunity_id, amount } = req.body;
    const amountNumber = Number(amount);
    if (!investor_id || !opportunity_id || !Number.isFinite(amountNumber) || amountNumber <= 0) {
      return res.status(400).json({ error: 'investor_id, opportunity_id y amount válidos son obligatorios.' });
    }

    await connection.beginTransaction();

    const [oppRows] = await connection.query('SELECT * FROM opportunities WHERE id = ? FOR UPDATE', [opportunity_id]);
    if (!oppRows.length) {
      await connection.rollback();
      return res.status(404).json({ error: 'Oportunidad no encontrada.' });
    }
    const opportunity = oppRows[0];

    const goalUnitCost = Number(opportunity.goal_unit_cost) || 0;
    const contributedUnits = goalUnitCost > 0 ? Math.floor(amountNumber / goalUnitCost) : 0;
    const nextFundedAmount = (Number(opportunity.funded_amount) || 0) + amountNumber;
    const nextUnits = (Number(opportunity.goal_current_units_funded) || 0) + contributedUnits;

    await connection.query(
      `INSERT INTO investments (investor_id, opportunity_id, amount, contributed_units, status, next_payment_date, monthly_payment)
       VALUES (?, ?, ?, ?, 'active', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 0)`,
      [investor_id, opportunity_id, amountNumber, contributedUnits]
    );

    await connection.query(
      `UPDATE opportunities
       SET funded_amount = ?, goal_current_units_funded = ?
       WHERE id = ?`,
      [nextFundedAmount, nextUnits, opportunity_id]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      investedAmount: amountNumber,
      contributedUnits,
      fundedAmount: nextFundedAmount,
      goalCurrentUnitsFunded: nextUnits
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// -- NOTIFICACIONES --
app.get('/api/notifications', async (req, res) => {
  const { user_id } = req.query;
  const [rows] = await pool.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', [user_id]);
  res.json(rows);
});

app.put('/api/notifications/:id/read', async (req, res) => {
  await pool.query('UPDATE notifications SET `read` = 1 WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

app.post('/api/notifications', async (req, res) => {
  try {
    const id = require('crypto').randomUUID();
    const { user_id, title, message, type } = req.body;
    await pool.query(
      'INSERT INTO notifications (id, user_id, title, message, type, `read`) VALUES (?, ?, ?, ?, ?, 0)',
      [id, user_id, title, message, type || 'info']
    );
    const [rows] = await pool.query('SELECT * FROM notifications WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -- NUEVO: REGISTROS FINANCIEROS (Para gráficas) --
app.get('/api/businesses/:id/financials', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM business_financial_records WHERE business_id = ? ORDER BY record_month ASC',
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -- NUEVO: PAGOS / AMORTIZACIONES --
app.get('/api/investments/:id/payments', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM payments WHERE investment_id = ? ORDER BY paid_at DESC',
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -- MÉTRICAS DE PORTAFOLIO --
app.get('/api/portfolio/:investor_id/metrics', async (req, res) => {
  try {
    const { investor_id } = req.params;
    const [rows] = await pool.query(
      `SELECT
        COALESCE(SUM(amount), 0) AS totalInvested,
        COALESCE(SUM(amount * (SELECT expected_roi FROM opportunities WHERE id = inv.opportunity_id) / 100), 0) AS accumulatedReturn,
        COALESCE(AVG(SELECT expected_roi FROM opportunities WHERE id = inv.opportunity_id), 0) AS averageROI,
        COUNT(CASE WHEN status = 'active' THEN 1 END) AS activeInvestments
       FROM investments inv
       WHERE investor_id = ?`,
      [investor_id]
    );
    const m = rows[0];
    const [avgRows] = await pool.query(
      `SELECT COALESCE(AVG(o.expected_roi), 0) AS averageROI
       FROM investments i JOIN opportunities o ON i.opportunity_id = o.id
       WHERE i.investor_id = ?`,
      [investor_id]
    );
    res.json({
      totalInvested: Number(m.totalInvested) || 0,
      accumulatedReturn: Number(m.accumulatedReturn) || 0,
      averageROI: Number(avgRows[0].averageROI) || 0,
      activeInvestments: Number(m.activeInvestments) || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -- NUEVO: CONTRATOS --
app.get('/api/contracts', async (req, res) => {
  try {
    const { investor_id, opportunity_id } = req.query;
    let query = 'SELECT * FROM contracts WHERE 1=1';
    const params = [];

    if (investor_id) {
      query += ' AND investor_id = ?';
      params.push(investor_id);
    }
    if (opportunity_id) {
      query += ' AND opportunity_id = ?';
      params.push(opportunity_id);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`✅ Servidor MySQL-Express local corriendo en http://localhost:${PORT}`);
});
