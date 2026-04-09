import mysql from 'mysql2/promise';

async function test() {
  const configs = [
    { port: 3307, user: 'root', password: '', database: 'safetyscore' },
    { port: 3306, user: 'root', password: '', database: 'safetyscore' }
  ];

  for (const config of configs) {
    try {
      console.log(`Testing port ${config.port}...`);
      const connection = await mysql.createConnection(config);
      const [rows] = await connection.execute('SELECT email FROM users LIMIT 1');
      console.log(`✅ Success on port ${config.port}:`, rows);
      await connection.end();
      process.exit(0);
    } catch (e) {
      console.log(`❌ Failed on port ${config.port}: ${e.message}`);
    }
  }
}

test();
