const { createApp, ref, computed, watch } = Vue;

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

createApp({
  setup() {
    let monsterHealth = ref(100);
    let playerHealth = ref(100);
    let round = ref(0);
    let winner = ref(null);
    let battleLog = ref([]);

    const respawned = () => {
      monsterHealth.value = 100;
      playerHealth.value = 100;
      round.value = 0;
      winner.value = null;
      battleLog.value = []
    };

    const writeBattleLog = (who, what, deals) => {
      battleLog.value.unshift({
        id: Math.random(),
        object: who,
        damage: deals,
        action: what,
      });
    };

    const attackMonster = () => {
      const power = getRandomInt(5, 12);

      monsterHealth.value -= power;
      writeBattleLog("player", "attack monster", power);

      round.value++;
      attackPlayer();
    };

    const specialAttack = () => {
      const power = getRandomInt(8, 12);
      monsterHealth.value -= power;
      writeBattleLog("player", "charge special attack", power);

      round.value++;
      attackPlayer();
    };

    const attackPlayer = () => {
      const power = getRandomInt(8, 14);
      playerHealth.value -= power;

      writeBattleLog("monster", "attack player", power);
    };

    const heal = () => {
      round.value++;
      healthPoint = getRandomInt(12, 16);

      if (playerHealth.value + healthPoint > 100) {
        playerHealth.value = 100;
      } else {
        writeBattleLog("player", "heal", healthPoint);
        playerHealth.value += healthPoint;
      }

      attackPlayer();
    };

    const surrender = () => {
      winner.value = "monster";
      writeBattleLog("player", "surrender", -1)
    };

    const monsterHealthBar = computed(() => {
      if (monsterHealth.value <= 0) {
        return { width: "0%" };
      }

      return { width: monsterHealth.value + "%" };
    });

    const playerHealthBar = computed(() => {
      if (playerHealth.value <= 0) {
        return { width: "0%" };
      }

      return { width: playerHealth.value + "%" };
    });

    const mayUseSpecialAttack = computed(() => {
      return round.value % 3 !== 0;
    });

    watch(playerHealth, (newVal, oldVal) => {
      if (newVal.value <= 0 && monsterHealth.value <= 0) {
        winner.value = "draw";
      } else if (newVal <= 0) {
        winner.value = "monster";
        Swal.fire({
          title: 'Error!',
          text: 'Do you want to continue',
          icon: 'error',
          confirmButtonText: 'Cool'
        })
      }
    });

    watch(monsterHealth, (newVal, oldVal) => {
      if (newVal.value <= 0 && playerHealth.value <= 0) {
        winner.value = "draw";
      } else if (newVal <= 0) {
        winner.value = "player";
      }
    });

    return {
      monsterHealth,
      monsterHealthBar,
      playerHealth,
      playerHealthBar,
      attackMonster,
      attackPlayer,
      specialAttack,
      heal,
      mayUseSpecialAttack,
      winner,
      respawned,
      surrender,
      battleLog,
    };
  },
}).mount("#game");
