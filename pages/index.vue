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
                    <i class="fa fa-minus-square"></i>
                  </span>
                  <span>Deselect All</span>
                </button>
              </div>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <div class="buttons has-addons">
                <button class="button">
                  <span class="icon is-small">
                    <i class="fa fa-stop"></i>
                  </span>
                  <span>Stop</span>
                </button>
                <button class="button">
                  <span class="icon is-small">
                    <i class="fa fa-pause"></i>
                  </span>
                  <span>Pause</span>
                </button>
                <button class="button is-primary">
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
  </section>
</template>

<script>
const ALL = 49;
const TO_SELECT = 6;
export default {
  data() {
    return {
      totalCount: TO_SELECT,
      numbers: Array.from({ length: ALL }).map((ignore, index) => index + 1),
      selectedNumbers: []
    };
  },
  computed: {
    selectedSorted() {
      return this.selectedNumbers.slice().sort((left, right) => left - right);
    },
    count() {
      return this.selectedNumbers
        .map(selected => (selected ? 1 : 0))
        .reduce((acc, el) => acc + el, 0);
    },
    partitioned() {
      return this.partition(this.numbers, Math.ceil(Math.sqrt(ALL)));
    }
  },
  methods: {
    partition(array, n) {
      return array.length
        ? [array.slice(0, n)].concat(this.partition(array.slice(n), n))
        : [];
    },
    isSelected(number) {
      return this.selectedNumbers.includes(number);
    },
    select(number) {
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

