<template>
  <section class="container">
    <div class="numbers">
      <div class="columns column-order is-gapless is-multiline has-text-centered">
        <div class="column"
          v-for="numbersRow in partitioned" 
          :key="numbersRow[0]"
          >
          <button
            v-for="number in numbersRow"
            :key="number"
            class="button is-rounded"
            :class="{ 'is-primary': isSelected(number) }" 
            @click="toggle(number)"
            >{{ number }}</button>
        </div>
      </div>
    </div>
    <div class="columns is-centered">
      <div class="column is-half">
        <progress class="progress is-small is-primary" 
          :value="count"
          :max="totalCount"
          ></progress>
      </div>
    </div>
    <div class="columns is-centered has-text-centered">
      <div class="column is-half">{{ count }} of {{ totalCount }}</div>
    </div>
    <div class="columns is-centered has-text-centered">
      <div class="column is-half">Your numbers are: {{ selectedSorted.join(", ") }}</div>
    </div>
    <div class="columns is-centered">
      <div class="column is-half">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <div class="buttons has-addons">
                <button class="button" @click="selectRandom">
                  <span class="icon is-small">
                    <i class="fa fa-random"></i>
                  </span>
                  <span>Random</span>
                </button>
                <button class="button" @click="deselectAll">
                  <span class="icon is-small">
                    <i class="fa fa-minus-circle"></i>
                  </span>
                  <span>Deselect All</span>
                </button>
              </div>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <div class="buttons has-addons">
                <button class="button" @click="reset">
                  <span class="icon is-small">
                    <i class="fa fa-undo"></i>
                  </span>
                  <span>Reset</span>
                </button>
                <button v-if="isRunning" class="button is-primary" @click="pause">
                  <span class="icon is-small">
                    <i class="fa fa-pause"></i>
                  </span>
                  <span>Pause</span>
                </button>
                <button v-else class="button is-primary" @click="run">
                  <span class="icon is-small">
                    <i class="fa fa-play"></i>
                  </span>
                  <span>Run</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-centered has-text-centered">
      <div class="column is-half">Number of iteration: {{ iteration }}</div>
    </div>
    <div class="columns is-centered has-text-centered">
      <div class="column">
        <ul>
          <li v-for="(value, key) in stats.hitsCounts()" :key="key">
            {{ key }} hits of {{ totalCount }} has been drawn {{ value }} times.
          </li>
        </ul>
        <ul>
          <li v-for="(value, key) in stats.numberHitsCount()" :key="key">
            Number {{ key }} has been drawn {{ value }} times.
          </li>
        </ul>
        <ul>
          <li v-for="(value, key) in stats.iterationsOfFirstHits()" :key="key">
            Your first hit of {{ key }} numbers has been made in {{ value }} round.
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import _ from "lodash";

import LottoSimulation from "~/utils/LottoSimulation";
import { Draw, Stats } from "~/utils/LottoSimulation";

const ALL = 49;
const TO_SELECT = 6;

export default {
  data() {
    return {
      totalCount: TO_SELECT,
      numbers: _.range(1, ALL + 1),
      selectedNumbers: [],
      lottoSimulation: new LottoSimulation(),
      iteration: 0,
      stats: new Stats([], [])
    };
  },

  computed: {
    isRunning() {
      return this.lottoSimulation.isRunning;
    },
    selectedSorted() {
      return this.selectedNumbers.slice().sort((left, right) => left - right);
    },
    count() {
      return this.selectedNumbers
        .map(selected => (selected ? 1 : 0))
        .reduce((acc, el) => acc + el, 0);
    },
    partitioned() {
      return _.chunk(this.numbers, Math.ceil(Math.sqrt(ALL)));
    }
  },

  methods: {
    isSelected(number) {
      return this.selectedNumbers.includes(number);
    },
    select(number) {
      if (this.selectedNumbers.includes(number)) {
        return;
      }
      this.selectedNumbers = [
        number,
        ...this.selectedNumbers.slice(0, TO_SELECT - 1)
      ];
    },
    deselect(number) {
      this.selectedNumbers = this.selectedNumbers.filter(
        selected => selected !== number
      );
    },
    toggle(number) {
      if (this.isSelected(number)) {
        this.deselect(number);
      } else {
        this.select(number);
      }
    },
    deselectAll() {
      this.selectedNumbers = [];
    },
    selectRandom() {
      this.deselectAll();
      while (this.count < TO_SELECT) {
        const randomNumber = Math.floor(Math.random() * ALL) + 1;
        this.select(randomNumber);
      }
    },
    run() {
      this.lottoSimulation.reset();
      const onNext = (numbers, iteration) => {
        this.iteration = iteration;
      };
      const onStop = stats => {
        this.pause();
        this.stats = stats;
      };
      this.lottoSimulation.start(this.selectedNumbers, onNext, onStop, 100000);
    },
    pause() {
      this.lottoSimulation.stop();
    },
    reset() {
      this.lottoSimulation.reset();
    }
  }
};
</script>

<style>
.numbers .columns {
  flex-direction: column;
}
.numbers .button {
  width: 50px;
  height: 50px;
  margin: 2px;
}
</style>

