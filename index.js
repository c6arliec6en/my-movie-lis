(function () {
	const BASE_URL = 'https://movie-list.alphacamp.io'
	const INDEX_URL = BASE_URL + '/api/v1/movies/'
	const POSTER_URL = BASE_URL + '/posters/'
	const data = []
	const dataPanel = document.getElementById('data-panel')
	const pagination = document.getElementById('pagination')
  	const ITEM_PER_PAGE = 12
  	const searchBtn = document.querySelector('#submit-search')
  	const searchInput = document.querySelector('#search')
  	const toggleDisplay = document.querySelector('.toggle-display')
  	let  paginationData = []
  	// 使用此變數讓程式記下現在的page，用於切換樣板時使用
  	let nowPage = '1'
  	// 初始展示的形式
  	let displayFormat = 'card'

	axios.get(INDEX_URL)
	.then((response) => {
		data.push(...response.data.results)
		// displayDataList(data)
		getTotalPages(data)
		getPageData(1, data)
	})
	.catch((err) => console.log(err))
  	
	
	function addFavoriteItem (favoriteId){
		console.log(favoriteId)
		const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
	    const movie = data.find(item => item.id === Number(favoriteId))

	    if (list.some(item => item.id === Number(favoriteId))) {
	      alert(`${movie.title} is already in your favorite list.`)
	    } else {
	      list.push(movie)
	      alert(`Added ${movie.title} to your favorite list!`)
	    }
	    localStorage.setItem('favoriteMovies', JSON.stringify(list))
	 }
	

	function showMovie (id) {
	    // get elements
	    const modalTitle = document.getElementById('show-movie-title')
	    const modalImage = document.getElementById('show-movie-image')
	    const modalDate = document.getElementById('show-movie-date')
	    const modalDescription = document.getElementById('show-movie-description')

	    // set request url
	    const url = INDEX_URL + id
	    console.log(url)

	    // send request to show api
	    axios.get(url).then(response => {
	      const data = response.data.results
	      console.log(data)

	      // insert data into modal ui
	      modalTitle.textContent = data.title
	      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
	      modalDate.textContent = `release at : ${data.release_date}`
	      modalDescription.textContent = `${data.description}`
	    })
	 }
	

	function displayDataList (data , format) { 
		displayFormat = format || displayFormat 
		let htmlContent = '' 
		
		if (displayFormat === 'list') {
			data.forEach(function (item, index) {

				htmlContent += `
				<div class='row justify-content-between align-items-center list-style'>
					<div class="movie-item-body">
					 	<h6 class="card-title">${item.title}</h5>
					</div>
					<div>
						<button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
			 			<button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
			 		</div>	
				</div>
				`
		})} else if (displayFormat === 'card') {
				data.forEach(function (item, index) {
					htmlContent += `
					  <div class="col-sm-3">
					    <div class="card mb-2">
					      <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
					      <div class="card-body movie-item-body">
					        <h6 class="card-title">${item.title}</h5>
					      </div>

					      <!-- "More" button -->
				            <div class="card-footer">
				              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
				              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
				            </div>
					    </div>
					  </div>
					`
			})
		
		
		}
		dataPanel.innerHTML = htmlContent
	}



  	function getTotalPages (data) {
	    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
	    let pageItemContent = ''
	    for (let i = 0; i < totalPages; i++) {
	      pageItemContent += `
	        <li class="page-item">
	          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
	        </li>
	      `
	    }
	    pagination.innerHTML = pageItemContent
  	}

  	function getPageData (pageNum, data) {
  		paginationData = data || paginationData
	    let offset = (pageNum - 1) * ITEM_PER_PAGE
	    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
	    displayDataList(pageData)
  	}

  	// listen to pagination click event
  	pagination.addEventListener('click', event => {
	    if (event.target.tagName === 'A') {
	    	nowPage = event.target.dataset.page
	      	getPageData(nowPage)

    	}
  	})
	// listen to search btn click event
	searchBtn.addEventListener('click', event => {
		event.preventDefault()
		const regex = new RegExp(searchInput.value, 'i')

	    results = data.filter(movie => movie.title.match(regex))
	    // 當搜尋時讓記憶的頁面初始化
	    nowPage = '1'
	    getTotalPages(results)
	    getPageData(1,results)
	})

	// Add favorite and more button
	dataPanel.addEventListener('click', (event) => {
		if (event.target.matches('.btn-show-movie')) {
		  	showMovie(event.target.dataset.id)
		} else if (event.target.matches('.btn-add-favorite')) {
      		addFavoriteItem(event.target.dataset.id)
    	}
	})

	// 切換樣板的監聽事件
	toggleDisplay.addEventListener('click', (event) => {
		if (event.target.matches('.fa-th')) {
			displayFormat = 'card'
			getPageData (nowPage)
		} else if (event.target.matches('.fa-bars')) {
			displayFormat = 'list'
			getPageData (nowPage)
		}
	})

})()	