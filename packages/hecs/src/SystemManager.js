export class SystemManager {
  constructor(world) {
    this.world = world
    this.Systems = new Map()
    this.systems = []
    this.systemsByName = {}
    this.tick = 0
  }

  register(System) {
    if (this.Systems.has(System)) {
      console.warn(`hecs: already registered system '${System.name}'`)
      return
    }
    const system = new System(this.world)
    this.Systems.set(System, system)
    let position = 0
    for (let i = 0; i < this.systems.length; i++) {
      const other = this.systems[i]
      if (other.order > system.order) break
      position = i + 1
    }
    this.systems.splice(position, 0, system)
    this.systemsByName[System.name] = system
    return this
  }

  init() {
    for (let i = 0; i < this.systems.length; i++) {
      const system = this.systems[i]
      system.init(this.world)
    }
  }

  get(System) {
    return this.Systems.get(System)
  }

  getByName(name) {
    return this.systemsByName[name]
  }

  update(delta) {
    for (let i = 0; i < this.systems.length; i++) {
      this.tick++
      const system = this.systems[i]
      const before = performance.now()
      if (system.active) system.update(delta)
      system.performance = performance.now() - before
    }
  }

  reset() {
    this.systems.forEach(system => {
      system.reset()
    })
  }
}
