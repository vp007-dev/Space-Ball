// MAKING NEW GAME

// console.log();
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')


canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEL = document.querySelector('#scoreEL')
const startGamebtn = document.querySelector('#startGamebtn')
const modalEl = document.querySelector('#modalEl')
const bigscoreEl = document.querySelector('#bigscoreEl')
class Player {
  constructor(x, y, radius, color){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw(){
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color;
    c.fill()
  }
}
class Projectile{
  constructor(x, y, radius, color, velocity){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }


  draw(){
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color;
    c.fill()
  }

  update(){
    this.draw()
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Enemy{
  constructor(x, y, radius, color, velocity){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }


  draw(){
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color;
    c.fill()
  }

  update(){
    this.draw()
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
const friction = 0.99;
class Particle{
  constructor(x, y, radius, color, velocity){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1
  }


  draw(){
    c.save()
    c.globalAlpha = this.alpha
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color;
    c.fill()
    c.restore()
  }

  update(){
    this.draw()
    this.velocity.x *= friction
    this.velocity.y *= friction
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

let player = new Player(x, y, 10, 'White')


// const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', {x:1, y:1})
// const projectile2 = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'green', {x:-1, y:-1})
let projectiles = []
let enemies = []
let particles = []

function init(){
  let player = new Player(x, y, 10, 'White')
  projectiles = []
  enemies = []
  particles = []
  score = 0
  scoreEL.innerHTML = score
  bigscoreEl.innerHTML = score
}

function spawnEnemies(){
  setInterval(()=>{
    const radius = Math.random() * (30 - 4) + 4
    let x;
    let y;
    if (Math.random() < 0.5){
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() * canvas.height;
      // const y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }else{
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }

    const color = `hsl(${Math.random() * 360}, 50%, 50%)`
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
    const velocity = {
      x: Math.cos(angle) * 4,
      y: Math.sin(angle) * 4
    }
    enemies.push(new Enemy(x, y, radius, color, velocity))
  }, 1000)
}

let animationId
let score = 0
function animate(){
  animationId = requestAnimationFrame(animate)
  c.fillStyle = "rgba(0, 0, 0, 0.1)"
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.draw()
  particles.forEach((particle, index) =>{
    if (particle.alpha <= 0){
      particles.splice(index, 1)
    }else{
      particle.update()
    }
  })

  projectiles.forEach((projectile, index)=> {
    projectile.update()
    if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
      setTimeout(()=>{
        // enemies.splice(index, 1)
        projectiles.splice(index, 1)
      }, 0)
    }
  })

  enemies.forEach((enemy, index) =>{
    enemy.update()
    const dist = Math.hypot(player.x- enemy.x, player.y - enemy.y)
    if(dist - enemy.radius - player.radius < 1){
      // alert("enfd game")
      console.log("GG");
      cancelAnimationFrame(animationId)
      modalEl.style.display = 'flex'
      bigscoreEl.innerHTML = score
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x- enemy.x, projectile.y - enemy.y)

      if(dist - enemy.radius - projectile.radius < 1){
        if(enemy.radius - 10 > 5){

          //increase score



          for (let i = 0; i < enemy.radius * 2; i++){
            particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {x: (Math.random() - 0.5) * (Math.random() * 8), y:(Math.random() - 0.5) * (Math.random() * 8)}))
          }
          gsap.to(enemy, {
            radius: enemy.radius - 10
          })
          setTimeout(()=>{
            // enemies.splice(index, 1)
            projectiles.splice(projectileIndex, 1)
          }, 0)

        }else{
          score += 250;
          scoreEL.innerHTML = score
          setTimeout(()=>{
            enemies.splice(index, 1)
            projectiles.splice(projectileIndex, 1)
          }, 0)
        }

      }
    });

  });

  // projectile.draw()
  // projectile.update()
}

addEventListener('click', (event) => {
  console.log(projectiles)
  const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
  const velocity = {
    x: Math.cos(angle) * 7,
    y: Math.sin(angle) * 7
  }
  console.log(angle)
  projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'White', velocity))

})

startGamebtn.addEventListener('click', ()=>{
  init()
  animate()
  spawnEnemies()
  modalEl.style.display = 'none'
})
