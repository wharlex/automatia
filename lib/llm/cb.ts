export class Circuit {
  state: 'closed' | 'open' | 'half' = 'closed';
  fails = 0;
  last = 0;
  
  shouldBlock() {
    return this.state === 'open' && Date.now() - this.last < 30000;
  }
  
  onFail() {
    this.fails++;
    if (this.fails >= 5) {
      this.state = 'open';
      this.last = Date.now();
    }
  }
  
  onOk() {
    this.fails = 0;
    if (this.state !== 'closed') {
      this.state = 'half';
    }
    if (this.state === 'half') {
      this.state = 'closed';
    }
  }
}
