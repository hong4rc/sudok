import BitCandidates from './BitCandidates';

const map = {};

export default class BCFactory {
  static gen(width, height) {
    const factory = (map[width] || {})[height] || new BCFactory(width, height);
    return new BitCandidates(factory);
  }

  width: number;
  height: number;
  length: number;
  allBit: number;
  truncH: {
    [key: number]: number;
  }
  truncW: {
    [key: number]: number;
  }

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.length = width * height;
    this.allBit = 2 ** this.length - 1;

    this.truncH = {};
    for (let i = 0; i < this.length; ++i) {
      this.truncH[i] = Math.trunc(i / height);
    }

    this.truncW = {};
    for (let i = 0; i < this.length; ++i) {
      this.truncW[i] = Math.trunc(i / width);
    }
  }
}
