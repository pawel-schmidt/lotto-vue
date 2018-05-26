import _ from "lodash";

class Lotto {
  constructor(min = 1, max = 49, numbersCount = 6) {
    this.min = min;
    this.max = max;
    this.numbersCount = numbersCount;
    this.numbers = _.range(min, max + 1);
  }

  static isHit(number, selectedNumbers) {
    return selectedNumbers.includes(number);
  }

  drawNumbers(count = this.numbersCount) {
    return _.shuffle(this.numbers).slice(0, count);
  }

  * generator(iterationCount = Infinity) {
    for (let i = 0; i < iterationCount; i++) {
      yield this.drawNumbers();
    }
  }
}

class Draw {
  constructor(numbers, iteration) {
    this.numbers = numbers;
    this.iteration = iteration;
  }
}

class Stats {
  constructor(selectedNumbers, hits) {
    this.selectedNumbers = selectedNumbers;
    this.hits = hits;
    this.hitsGrouppedByHits = _.groupBy(hits, hit => _.intersection(hit.numbers, selectedNumbers).length);
  }

  hitsCounts() {
    return this.hitsGrouppedByHits.map(hits => hits.length);
  }

  asdf() {
    this.hit = _.intersection(numbers, this.selectedNumbers);
    this.missed = _.difference(numbers, this.selectedNumbers);
    // return this.hits.;
  }

  firstIterations() {
    // const
  }
}

export default class LottoSimulation {
  constructor(min = 1, max = 49, numbersCount = 6, endOnHitAll = true) {
    if (min < 0) throw "min parameter has to be greater or equal to 0.";
    if (max < min) throw "max parameter has to be greater or equal min parameter.";
    if (numbersCount > (max - min + 1)) throw "numbersCount parameter has to be less or equal max - min + 1 value.";
    this.min = min;
    this.max = max;
    this.numbersCount = numbersCount;
    this.lotto = new Lotto(min, max, numbersCount);
    this.lottoGenerator = lotto.generator;
    this.reset(); // isRunning, hitDraws, iteration
  }

  getStats() {
    return new Stats(this.hitDraws);
  }

  start(selectedNumbers = this.lotto.drawNumbers(), onNext = (numbers, iteration) => undefined, onStop = (stats) => undefined) {
    this.isRunning = true;
    do {
      this.iteration++;
      const numbers = this.generator.next();
      onNext(numbers, this.iteration);

      if (selectedNumbers.some(Lotto.isHit)) {
        const hitDraw = new Draw(numbers, this.iteration);
        this.hitDraws.push(hitDraw);

        if (endOnHitAll && selectedNumbers.every(Lotto.isHit)) {
          stop();
        }
      }
    } while (this.isRunning);
    onStop(this.getStats());
  }

  stop() {
    this.isRunning = false;
  }

  reset() {
    this.stop();
    this.hitDraws = Array(this.numbersCount);
    this.iteration = 0;
  }
}
