//  =========== Jquery =========== 
setTimeout(function () {
  $(".loader").fadeToggle();
}, 1000);

$("a[href='#top']").click(function () {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  return false;
});


// ===========  Javascript =========== 
// Quran API
const apiUrl = "https://mp3quran.net/api/v3";
const language = "ar";

// GET ALL RECITERS
async function getReciters() {
  const chooseReciter = document.querySelector("#chooseReciter");
  const res = await fetch(`${apiUrl}/reciters?language=${language}`);
  const data = await res.json();
  chooseReciter.innerHTML = `<option value="">اختر قارئ</option>`;

  data.reciters.forEach((reciter) => {
    chooseReciter.innerHTML += `<option value="${reciter.id}">${reciter.name}</option>`;
  });
  chooseReciter.addEventListener("change", (e) => {
    getMoshaf(e.target.value);
  });
}

getReciters();

// GET ALL Moshaf
async function getMoshaf(reciter) {
  const chooseMoshaf = document.querySelector("#chooseMoshaf");
  const res = await fetch(
    `${apiUrl}/reciters?language=${language}&reciter=${reciter}`
  );
  const data = await res.json();

  chooseMoshaf.innerHTML = `<option value="" data-server="" data-surahList ="">اختر مصحف</option>`;

  const allMoshaf = data.reciters[0].moshaf;

  allMoshaf.forEach((moshaf) => {
    chooseMoshaf.innerHTML += `<option
     value="${moshaf.id}"
     data-server="${moshaf.server}"
     data-surahList ="${moshaf.surah_list}"
     >${moshaf.name}</option>`;
  });

  chooseMoshaf.addEventListener("change", (e) => {
    const selectedMoshaf = chooseMoshaf.options[chooseMoshaf.selectedIndex];
    const surahServer = selectedMoshaf.dataset.server;
    const surahList = selectedMoshaf.dataset.surahlist;
    getSurah(surahServer, surahList);
  });
}

// GET ALL Surah
async function getSurah(surahServer, surahList) {
  const chooseSurah = document.querySelector("#chooseSurah");
  const res = await fetch(`${apiUrl}/suwar`);
  const data = await res.json();

  chooseSurah.innerHTML = `<option value="">اختر سورة</option>`;


  const surahNames = data.suwar;

  surahList = surahList.split(",");

  surahList.forEach((surah) => {
    const padSurah = surah.padStart(3, "0");

    surahNames.forEach((surahName) => {
      if (surahName.id == surah) {
        chooseSurah.innerHTML += `<option value="${surahServer}${
          padSurah + ".mp3"
        }">${surahName.name}</option>`;
      }
    });
  });




  chooseSurah.addEventListener("change", (e) => {
    const selectedSurah = chooseSurah.options[chooseSurah.selectedIndex];
    playSurah(selectedSurah.value);
  });
}


// PLAY Surah
function playSurah(surahMp3) {
  const audioPlayer = document.querySelector("#audioPlayer");
  audioPlayer.src = surahMp3;

  audioPlayer.play();
}



// playLive [ Quran Live Stream & Sunna Live Stream ]
playLive = (channel) => {
  if(Hls.isSupported()) {
    const video = document.getElementById('liveVideo');
    const hls = new Hls();
    hls.loadSource(`${channel}`);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      video.play();
    });
  }

}