class Module {
  constructor (name, prod_bonus, speed_bonus) {
    this.name = name;
    this.prod_bonus = prod_bonus;
    this.speed_bonus = speed_bonus;
  }
}

class Modules {
  constructor(names = []) {
    this.modules = names.filter(n => n !== 'null').map((n) => MODULES[n]);
    this.prod_bonus = this.modules.reduce((t, m) => t + m.prod_bonus, 0);
    this.speed_bonus = this.modules.reduce((t, m) => t + m.speed_bonus, 0);
  }
}

class Beacons {
  constructor(modules, count) {
    this.modules = modules;
    this.count = count;
    this.prod_bonus = 0;
    this.speed_bonus = 1.5 * Math.sqrt(this.count || 1) * this.modules.speed_bonus;
  }
}

class Config {
  constructor(modules, beacons) {
    this.modules = modules;
    this.beacons = beacons;
    this.prod_bonus = modules.prod_bonus + beacons.prod_bonus;
    this.speed_bonus = modules.speed_bonus + beacons.speed_bonus;
  }
}

class Solution {
  constructor(
    item,
    config,
    machine,
    machines_needed,
    actual_machines,
    target_rate,
    actual_rate,
  ) {
    this.item = item;
    this.config = config;
    this.machine = machine;
    this.machines_needed = machines_needed;
    this.actual_machines = actual_machines;
    this.target_rate = target_rate;
    this.actual_rate = actual_rate;
  }
}

const MODULES = {
  'pe': new Module('pe', 0.04, -0.05),
  'p2': new Module('p2', 0.06, -0.10),
  'p3': new Module('p3', 0.10, -0.15),

  'se': new Module('se', 0.00, 0.20),
  's2': new Module('s2', 0.00, 0.30),
  's3': new Module('s3', 0.00, 0.50),
};

/**
 * These are the item recipes that the solver uses.
 *
 * Some might be missing, so feel free to add them for others.
 */
export const Recipes = {
  'Accumulator':                  { craft_time: 10,   product_count: 1,    allows_prod: false, machine: 'assembling-machine' },
  'Advanced Circuit':             { craft_time: 6,    product_count: 1,    allows_prod: true,  machine: 'assembling-machine' },
  'Automation Science Pack':      { craft_time: 5,    product_count: 1,    allows_prod: true,  machine: 'assembling-machine' },
  'Battery':                      { craft_time: 4,    product_count: 1,    allows_prod: true,  machine: 'chemical-plant' },
  'Chemical Science Pack':        { craft_time: 24,   product_count: 2,    allows_prod: true,  machine: 'assembling-machine' },
  'Copper Cable':                 { craft_time: 0.5,  product_count: 2,    allows_prod: true,  machine: 'assembling-machine' },
  'Copper Plate':                 { craft_time: 3.2,  product_count: 1,    allows_prod: true,  machine: 'furnace' },
  'Electric Engine Unit':         { craft_time: 10,   product_count: 1,    allows_prod: true,  machine: 'assembling-machine' },
  'Electric Furnace':             { craft_time: 5,    product_count: 1,    allows_prod: false, machine: 'assembling-machine' },
  'Electronic Circuit':           { craft_time: 0.5,  product_count: 1,    allows_prod: true,  machine: 'assembling-machine' },
  'Engine Unit':                  { craft_time: 10,   product_count: 1,    allows_prod: true,  machine: 'assembling-machine' },
  'Flying Robot Frame':           { craft_time: 20,   product_count: 1,    allows_prod: true,  machine: 'assembling-machine' },
  'Grenade':                      { craft_time: 8,    product_count: 1,    allows_prod: false, machine: 'assembling-machine' },
  'Inserter':                     { craft_time: 0.5,  product_count: 1,    allows_prod: false, machine: 'assembling-machine' },
  'Iron Gear Wheel':              { craft_time: 0.5,  product_count: 1,    allows_prod: true,  machine: 'assembling-machine' },
  'Iron Stick':                   { craft_time: 0.5,  product_count: 2,    allows_prod: true,  machine: 'assembling-machine' },
  'Logistic Science Pack':        { craft_time: 6,    product_count: 1,    allows_prod: true,  machine: 'assembling-machine' },
  'Low Density Structure':        { craft_time: 15,   product_count: 1,    allows_prod: true,  machine: 'assembling-machine' },
  'Military Science Pack':        { craft_time: 10,   product_count: 2,    allows_prod: true,  machine: 'assembling-machine' },
  'Piercing Rounds Magazine':     { craft_time: 3,    product_count: 1,    allows_prod: false, machine: 'assembling-machine' },
  'Pipe':                         { craft_time: 0.5,  product_count: 1,    allows_prod: false, machine: 'assembling-machine' },
  'Plastic Bar':                  { craft_time: 1,    product_count: 2,    allows_prod: true,  machine: 'chemical-plant' },
  'Processing Unit':              { craft_time: 10,   product_count: 1,    allows_prod: true,  machine: 'assembling-machine' },
  'Production Science Pack':      { craft_time: 21,   product_count: 3,    allows_prod: true,  machine: 'assembling-machine' },
  'Radar':                        { craft_time: 0.5,  product_count: 1,    allows_prod: false, machine: 'assembling-machine' },
  'Rail':                         { craft_time: 0.5,  product_count: 2,    allows_prod: false, machine: 'assembling-machine' },
  'Rocket Control Unit':          { craft_time: 30,   product_count: 1,    allows_prod: true,  machine: 'rocket-silo' },
  'Rocket Fuel':                  { craft_time: 30,   product_count: 1,    allows_prod: true,  machine: 'assembling-machine' },
  'Rocket Part':                  { craft_time: 3,    product_count: 1,    allows_prod: true,  machine: 'rocket-silo' },
  'Satellite':                    { craft_time: 5,    product_count: 1,    allows_prod: false, machine: 'assembling-machine' },
  'Solar Panel':                  { craft_time: 10,   product_count: 1,    allows_prod: false, machine: 'assembling-machine' },
  'Solid Fuel From Light Oil':    { craft_time: 2,    product_count: 1,    allows_prod: true,  machine: 'chemical-plant' },
  'Steel Plate':                  { craft_time: 16,   product_count: 1,    allows_prod: true,  machine: 'furnace' },
  'Stone Brick':                  { craft_time: 3.2,  product_count: 1,    allows_prod: true,  machine: 'furnace' },
  'Sulfur':                       { craft_time: 1,    product_count: 2,    allows_prod: true,  machine: 'chemical-plant' },
  'Sulfuric Acid':                { craft_time: 1,    product_count: 50,   allows_prod: true,  machine: 'chemical-plant' },
  'Transport Belt':               { craft_time: 0.5,  product_count: 2,    allows_prod: false, machine: 'assembling-machine' },
  'Utility Science Pack':         { craft_time: 21,   product_count: 3,    allows_prod: true,  machine: 'assembling-machine' },
  'Wall':                         { craft_time: 0.5,  product_count: 1,    allows_prod: true,  machine: 'assembling-machine' },
  /**
   * This one is a bit unique, because it's a rocket launch that produces 1000 space science packs.
   * The craft time here was derived from the Kirk McDonald calculator.
   */
  'Space Science Pack': { craft_time: 340.5665892, product_count: 1000, allows_prod: false, machine: 'rocket-silo' },
};


/**
 * These are the machine types, and the specific machines within that type.
 */
export const Machines = {
  'assembling-machine': [
    { name: 'assembling-machine-1', craft_speed: 0.50, slots: 0 },
    { name: 'assembling-machine-2', craft_speed: 0.75, slots: 2 },
    { name: 'assembling-machine-3', craft_speed: 1.25, slots: 4 },
  ],
  'furnace':         [
    { name: 'electric-furnace', craft_speed: 2.00, slots: 2 },
    { name: 'steel-furnace',    craft_speed: 2.00, slots: 0 },
    { name: 'stone-furnace',    craft_speed: 1.00, slots: 0 }
  ],
  'chemical-plant':  [
    { name: 'chemical-plant', craft_speed: 1.00, slots: 3 },
  ],
  'oil-refinery':    [
    { name: 'oil-refinery', craft_speed: 1.00, slots: 3 },
  ],
  'rocket-silo':     [
    { name: 'rocket-silo', craft_speed: 1.00, slots: 4 },
  ],
};


/**
 * Beacons don't have production modules.
 */
const MAX_BEACONS = 12;
const BEACON_MODULES = ['null', 'se', 's2', 's3'];



const MACHINE_MODULES = ['null', 'se', 's2', 's3', 'pe', 'p2', 'p3'];


/**
 *
 */
function generate_configs() {
  const configs = [
    new Config([], 0),
  ]
  for (let b1 = 0; b1 < BEACON_MODULES.length; b1++) {
    for (let b2 = b1; b2 < BEACON_MODULES.length; b2++) {
      const beacon_modules = new Modules([
        BEACON_MODULES[b1],
        BEACON_MODULES[b2],
      ]);
      if (beacon_modules.modules.length === 0) {
        continue;
      }
      for (let m1 = 0; m1 < MACHINE_MODULES.length; m1++) {
        for (let m2 = m1; m2 < MACHINE_MODULES.length; m2++) {
          for (let m3 = m2; m3 < MACHINE_MODULES.length; m3++) {
            for (let m4 = m3; m4 < MACHINE_MODULES.length; m4++) {
              const modules = new Modules([
                MACHINE_MODULES[m1],
                MACHINE_MODULES[m2],
                MACHINE_MODULES[m3],
                MACHINE_MODULES[m4],
              ]);
              for (let bN = 1; bN <= MAX_BEACONS; bN++) {
                const beacons = new Beacons(beacon_modules, bN);
                configs.push(new Config(modules, beacons));
              }
            }
          }
        }
      }
    }
  }
  return configs;
}

const configs = generate_configs();

/**
 * Finds qualifying solutions for the give item name and target rate per min.
 */
function validate(input) {
  if (!Recipes[input.item]) {
    return 'Recipe not found';
  }
  return null;
}

/**
 * Finds qualifying solutions for the give item name and target rate per min.
 *
 * @returns {Array} An array of objects containing the solution details.
 */
function solve(input) {
  const solutions = [];

  const item = input.item;
  const recipe = Recipes[item];
  const target_rate = parseFloat(input.rate);
  const min_prod = parseFloat(input.min_prod) / 100;
  const max_beacons = parseInt(input.max_beacons);

  const machines = Machines[recipe.machine];
  /**
   * Try every machine configuration...
   */
  for (const config of configs) {
    /**
     * Disqualify this config if the total production bonus is less than the
     * current minimum production constraint (entered as a percentage).
     */
    if (config.prod_bonus < min_prod) {
      continue
    }
    /**
     * Disqualify this config if the number of beacons is greater than the
     * current maximum beacon count constraint.
     */
    if (config.beacons.count > max_beacons) {
      continue
    }
    /**
     * Disqualify this config if there is a production bonus, and also that
     * the item does not support production modules (is not intermediate).
     */
    if (config.prod_bonus > 0 && !recipe.allows_prod) {
      continue
    }
    /**
     * For each machine of the item's machine type...
     */
    for (const machine of machines) {
      /**
       * Disqualify this config if it involves more modules than the machine supports.
       */
      if (config.modules.count > machine.slots) {
        continue
      }
      /**
       * Calculate the number of machines needed and the actual rate using that number.
       */
      const craft_per_second = machine.craft_speed / recipe.craft_time * (1 + config.speed_bonus);
      const items_per_minute = craft_per_second * recipe.product_count * (1 + config.prod_bonus) * 60;
      /**
       * Can't have fractional machines in practice, so the actual rate will
       * always be spot on or slightly more than the target rate.
       */
      const machines_needed = target_rate / items_per_minute;
      const actual_machines = Math.ceil(machines_needed);

      const actual_rate = items_per_minute * actual_machines;
      /**
       * Qualify the solution if the difference between the actual rate and the
       * target rate (over-production rate) is within 1% of the target rate.
       *
       * OR, if the number of machines is ~1 (potentially with a large remainder).
       */
      if ((actual_rate - target_rate) / target_rate <= 0.01 || machines_needed <= 1) {
        solutions.push(new Solution(
          item,
          config,
          machine,
          machines_needed,
          actual_machines,
          target_rate,
          actual_rate,
        ));
      }
    }
  }
  return solutions;
}

/**
 * Sorts given solutions by the current sorting preference.
 */
function compare(order) {
  const comparisons = {
    'precision': solution => solution.actual_rate,
    'production': solution => solution.config.prod_bonus,
    'machines': solution => solution.actual_machines,
  };
  const comparator = order.split(',').map(field => {
    const dir = field.startsWith('-') ? -1 : +1;
    const key = field.replace(/^-/, '');
    return (a, b) => {
      if (comparisons[key](a) < comparisons[key](b)) return -dir;
      if (comparisons[key](a) > comparisons[key](b)) return +dir;
      return 0;
    }
  });
  return (a, b) => {
    for (const fn of comparator) {
      const cmp = fn(a, b);
      if (cmp !== 0) return cmp;
    }
    return 0;
  }
}

// 4. Listen for messages from the main thread
self.onmessage = (event) => {
  const { type, payload } = event.data;
  const { input, limit } = payload;
  switch (type) {
    /**
     *
     */
    case 'solve': {
      const error = validate(input)
      if (error) {
        self.postMessage({ type, payload: { input, error } })
        return
      }
      const solutions = solve(input).sort(compare(input.sort)).slice(0, limit)
      self.postMessage({ type, payload: { input, solutions }})
    }
  }
}
