import _ from "lodash";

export class Lotto {
  constructor(min = 1, max = 49, numbersCount = 6) {
    this.min = min;
    this.max = max;
    this.numbersCount = numbersCount;
    this.numbers = _.range(min, max + 1);
  }

  drawNumbers(count = this.numbersCount) {
    return _.sampleSize(this.numbers, count);
  }

  * generator(iterationCount = Infinity) {
    for (let i = 0; i < iterationCount; i++) {
      yield this.drawNumbers();
    }
  }
}

export class Draw {
  constructor(numbers, iteration) {
    this.numbers = numbers;
    this.iteration = iteration;
  }

  hitNumbers(selectedNumbers) {
    return _.intersection(this.numbers, selectedNumbers);
  }

  missedNumbers(selectedNumbers) {
    return _.difference(this.numbers, selectedNumbers);
  }
}

export class Stats {
  constructor(selectedNumbers, draws) {
    this.selectedNumbers = selectedNumbers;
    this.draws = draws;
    this.drawsGrouppedByHitsCounts = _.groupBy(draws, draw => draw.hitNumbers(selectedNumbers).length);
  }

  hitsCounts() {
    return _.mapValues(this.drawsGrouppedByHitsCounts, draw => draw.length);
  }

  numberHitsCount() {
    const hitNumbers = _.flatten(this.draws.map(draw => draw.hitNumbers(this.selectedNumbers)));
    return _.countBy(hitNumbers);
  }

  iterationsOfFirstHits() {
    return _.mapValues(this.drawsGrouppedByHitsCounts, draws => _.minBy(draws, draw => draw.iteration));
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
    this.reset(); // isRunning, hitDraws, iteration
  }

  getStats(selectedNumbers) {
    return new Stats(selectedNumbers, this.hitDraws);
  }

  start(selectedNumbers = this.lotto.drawNumbers(), onNext = (numbers, iteration) => undefined, onStop = (stats) => undefined, iterationCount = Infinity) {
    this.isRunning = true;
    const generator = this.lotto.generator(iterationCount);
    const isHit = (number) => selectedNumbers.includes(number);
    do {
      this.iteration++;
      const next = generator.next();
      if (next.done) {
        break;
      }
      const numbers = next.value;
      onNext(numbers, this.iteration);

      if (numbers.some(isHit)) {
        const hitDraw = new Draw(numbers, this.iteration);
        this.hitDraws.push(hitDraw);

        if (this.endOnHitAll && numbers.every(isHit)) {
          stop();
        }
      }
    } while (this.isRunning);
    onStop(this.getStats(selectedNumbers));
  }

  stop() {
    this.isRunning = false;
  }

  reset() {
    this.stop();
    this.hitDraws = [];
    this.iteration = 0;
  }
}
