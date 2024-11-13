
let currentsong=new Audio();
let songs;
let currFolder;

function convertSecondsToMinutes(seconds) {
    if(isNaN(seconds)|| seconds<0){
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format seconds with leading zero if necessary1
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${minutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currFolder=folder;
    let a=await fetch(`${folder}/`)
    let response=await a.text();
    let div=document.createElement("div")
    div.innerHTML=response
    let as=div.getElementsByTagName("a")
    songs=[]
    for(let index=0;index<as.length;index++){
        element=as[index]
        console.log(songs[index])
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
      // Show all the song in the li
      let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0]
      songUL.innerHTML=""
      for (const song of songs) {
        console.log(songs)
          songUL.innerHTML=songUL.innerHTML+ `<li> <img class="invert" src="svg/music.svg" alt="">
                              <div class="info">
                                  <div>${song.replaceAll("%20"," ")}</div>
                                  <div></div>
                              </div>
                              <div class="playnow">
                                  <span>play now</span>
                              <img class="invert" src="svg/playsong.svg" alt="">
                              </div>
           </li>`;
      }
  
      // Attach a new eventListner to each songs
     Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
      e.addEventListener("click",element=>{
          playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
      })
     })
     return songs;
  
}
const playMusic=(track,pause=false)=>{
    
    currentsong.src=`/${currFolder}/` + track
   if(!pause){
    currentsong.play()
    play.src="svg/pause.svg"
   }

    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"

    
}
async function displayAlbums() {
    let a=await fetch(`../songs/`)
    let response=await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
    let anchors=div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer");
    let array=Array.from(anchors)
    for(let index=0;index<array.length;index++){
        const e=array[index];

        if(e.href.includes("../songs/")){
            let folder=e.href.split("/songs/").slice(-1)[0]
             // Get the meta data of the folder
            let a=await fetch(`/songs/${folder}/info.json`)
           let response=await a.json();
           cardContainer.innerHTML=cardContainer.innerHTML+` <div data-folder="${folder}" class="card ">
                        <div class="play">
                            <img src="svg/play.svg" alt="">
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.discription}</p>
                    </div>` 
        }
    }
    //   Load the playlist whenever card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async () => {
                songs = await getsongs(`songs/${e.dataset.folder}`);
                // playMusic(songs[0])
            });
        });
        Array.from(document.getElementsByClassName("play")).forEach(e => {
            e.addEventListener("click", async () => {
                playMusic(songs[0])
            });
        });
}

async function main() {
    await getsongs("songs/ncs")
    playMusic(songs[0],true)

 
        // Function to display all the albums
        displayAlbums();

        // Attach an event Listner to play,next,previous
        play.addEventListener("click",()=>{
            if(currentsong.paused){
                currentsong.play()
                play.src="svg/pause.svg"
            }
            else{
                currentsong.pause()
                play.src="svg/play.svg"
            }
        })

        // Listen for time update function
        currentsong.addEventListener("timeupdate", () => {
            const currentTime = Math.floor(currentsong.currentTime);
            const duration = Math.floor(currentsong.duration);
            
            document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currentTime)} / ${convertSecondsToMinutes(duration)}`;
            document.querySelector(".cir").style.left=(currentsong.currentTime/currentsong.duration)*100 + "%";
        });
        
        // Add an eventListener to seakbar
         document.querySelector(".seakbar").addEventListener("click",e=>{
            let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
            document.querySelector(".cir").style.left=percent+"%";
            currentsong.currentTime=((currentsong.duration)*percent)/100
         })
        
        //  Add an Event Listner for a Hamburger
        document.querySelector(".hamburger").addEventListener("click",()=>{
            document.querySelector(".left").style.left="0"
        })
        //  Add an Event Listner for a clode button
        document.querySelector(".close").addEventListener("click", () => {
            document.querySelector(".left").style.left = "-120%";
        });
        // Add an event Listner to previous
        previous.addEventListener("click",()=>{
            currentsong.pause()
            let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
            if((index-1)>=0){
                playMusic(songs[index-1])
            }
        })
         // Add an event Listner to next
         next.addEventListener("click",()=>{
            currentsong.pause()
            let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
            if((index+1)<songs.length){
                playMusic(songs[index+1])
            }
        })
        // Add event listener for when the current song ends to play the next song
        currentsong.addEventListener('ended', () => {
            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
        playMusic(songs[index + 1]);
        } else {
        // Optionally, loop back to the first song if all songs have been played
        playMusic(songs[0]);
    }
});
        //Add eventlistner to volume button
        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
            currentsong.volume=parseInt(e.target.value)/100
        })

    //   Add eventlistner to volume button
    document.querySelector(".vol >img").addEventListener("click",e=>{
        console.log(e)
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            currentsong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg")
            currentsong.volume=0.20;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0.20;
        }
    })
        
}
main()
