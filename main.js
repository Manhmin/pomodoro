// Update the time
const timer = {
    pomodoro: 50,
    shortBreak: 3,
    longBreak: 5,
    longBreakInterval: 5,
    sessions: 5
}

let interval


const buttonSound = new Audio('/Sounds/button-sound.mp3')
const mainButton = document.getElementById('js-btn')
mainButton.addEventListener('click', () => {
    buttonSound.play()
    const { action } = mainButton.dataset
    if (action === 'start' & timer.mode === 'pomodoro') {
        playMusic()
    }
    if (action === 'start') {
        startTimer()
        

    } else {
        stopTimer()
        pauseMusic()
   
    }

    

})

const modeButtons = document.querySelector('#js-mode-buttons')
modeButtons.addEventListener('click', handleMode)

function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date())
    const difference = endTime - currentTime

    const total = Number.parseInt(difference / 1000, 10)
    const minutes = Number.parseInt((total / 60) % 60, 10)
    const seconds = Number.parseInt(total % 60, 10)

    return {
        total,
        minutes,
        seconds,
    }
}

function startTimer() {
    let { total } = timer.remainingTime
    const endTime = Date.parse(new Date()) + total * 1000

    if (timer.mode === 'pomodoro') timer.sessions++

    mainButton.dataset.action = 'stop'
    mainButton.textContent = 'stop'
    mainButton.classList.add('active')

    interval = setInterval(function() {
        timer.remainingTime = getRemainingTime(endTime)
        updateClock()

        total = timer.remainingTime.total
        if (total <= 0 ) {
            clearInterval(interval)

            switch (timer.mode) {
                case 'pomodoro':
                    if (timer.sessions % timer.longBreakInterval === 0) {
                        switchMode('longBreak')
                        pauseMusic()

                    } else {
                        switchMode('shortBreak')
                        pauseMusic()

                    }
                    break
                default:
                    switchMode('pomodoro')
                    music.currentTime = 0;
                    playMusic()
            }

            if (Notification.permission === 'granted') {
                const text =
                  timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
                new Notification(text);
              }

            startTimer()
        }
    }, 1000)
}

function stopTimer() {
    clearInterval(interval)

    mainButton.dataset.action = 'start'
    mainButton.textContent = 'start'
    mainButton.classList.add('active')
}

function updateClock() {
    const { remainingTime } = timer
    const minutes = `${remainingTime.minutes}`.padStart(2, '0')
    const seconds = `${remainingTime.seconds}`.padStart(2, '0')

    const min = document.getElementById('js-minutes')
    const sec = document.getElementById('js-seconds')
    min.textContent = minutes
    sec.textContent = seconds

    const text = timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!'
    document.title = `${minutes}:${seconds} - ${text}`

}


function switchMode(mode) {
    timer.mode = mode
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0,
    }

    document
        .querySelectorAll('div[data-mode]')
        .forEach(e => e.classList.remove('active'));

    document.querySelector(`[data-mode="${mode}"]`).classList.add('active')
    document.body.style.backgroundImage = `var(--${mode})`

    updateClock()
}



function handleMode(event) {
    const { mode } = event.target.dataset
    if (!mode) return

    switchMode(mode)
    stopTimer()
    
}


document.addEventListener('DOMContentLoaded', () => {
    if ('Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(function(permission) {
          if (permission === 'granted') {
            new Notification(
              'Awesome! You will be notified at the start of each session'
            );
          }
        });
      }
    }
  
    switchMode('pomodoro')
  })


const dropdown = document.querySelector('.music-dropdown')
dropdown.onclick = function() {
    dropdown.classList.toggle('active')
}

const pickSong = document.getElementById('pick-song')
const chooseSong = document.getElementById('choose-song')
const popup = document.getElementById('music-popup')
const musicDropdown = document.getElementById('music-dropdown')

pickSong.onclick = function() {
    popup.classList.toggle('hide-popup')
    musicDropdown.classList.toggle('active')
   
}

musicDropdown.onclick = function() {
    popup.classList.toggle('hide-popup')
    musicDropdown.classList.toggle('active')
}

playMusic = function () {}
pauseMusic = function () {}  

const musicSongs = document.querySelectorAll('.music-song')



musicSongs.forEach(musicSong => {
    const musicAudio = musicSong.querySelector('.audio-music')
    musicSong.addEventListener('click', function () {
        musicSongs.forEach(song => song.classList.remove('active'))
        this.classList.add('active')       
    })

    musicSong.onclick = function() {   

        chooseSong.innerHTML = this.textContent
        popup.classList.toggle('hide-popup')
        musicDropdown.classList.toggle('active')
        let musicId = musicAudio.dataset.sound
        let music = document.querySelector(`[data-sound=${musicId}]`)

        if (music) {
            playMusic = function() {
                music.play()
            }
            pauseMusic = function() {
                music.pause()
            } 
        }

    }

})






















