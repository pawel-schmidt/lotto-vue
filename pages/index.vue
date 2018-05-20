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

