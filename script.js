// const
const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');
const apiURL = 'https://api.lyrics.ovh';


// function
// 搜尋歌手或歌曲
async function searchSongs(term){
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();

    showData(data);
}

// 顯示歌手和歌曲在dom
function showData(data) {
    // 顯示查詢結果
    result.innerHTML = `
    <ul class="songs">
      ${data.data
        .map(
          song => `<li>
      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
      <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    </li>`
        )
        .join('')}
    </ul>
    `;

    // 顯示上一頁 下一頁按鈕
    if(data.prev || data.next) {
        more.innerHTML = `
        ${
          data.prev
            ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
            : ''
        }
        ${
          data.next
            ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
            : ''
        }
      `;
    } else {
        more.innerHTML = '';
    }
}

// 取得prev next 的歌曲
// need to complete http://cors-anywhere.herokuapp.com/corsdemo before trying on local server
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();

    showData(data);
}


// 取得歌詞 (api.lyrics.ovh 已經關閉此api)
async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
    <span>${lyrics}</span>`;

    more.innerHTML = '';
}


// eventlistner
// 搜尋歌曲
form.addEventListener('submit' , e =>{
    e.preventDefault();
    // 取得搜尋的值
    const searchTerm = search.value.trim();
    // 檢查機制
    if(!searchTerm) {
        alert('請輸入任一關鍵字進行查詢')
    } else {
        searchSongs(searchTerm);
    }

})

// 點選 getlyrics按鈕
result.addEventListener('click' , e =>{
    const clickedEl = e.target;

    if(clickedEl.tagName === 'BUTTON'){
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songtitle');

        getLyrics(artist, songTitle);
    }

});