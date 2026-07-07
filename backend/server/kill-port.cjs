const { execSync } = require('child_process')
try {
  const out = execSync('netstat -ano', { encoding: 'utf8', timeout: 3000 })
  const lines = out.split('\n').filter(l => l.includes(':3000') && l.includes('LISTENING'))
  for (const line of lines) {
    const parts = line.trim().split(/\s+/)
    const pid = parts[parts.length - 1]
    if (pid && !isNaN(pid)) {
      execSync('taskkill /f /pid ' + pid, { stdio: 'ignore' })
      console.log('已释放端口 3000 (PID: ' + pid + ')')
    }
  }
} catch (e) {
  // 端口未被占用
}
