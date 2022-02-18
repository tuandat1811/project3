const buttonShows = document.querySelectorAll('.product-btn button')
buttonShows.forEach((btn) => {
	btn.addEventListener('click', (e) => {
        console.log('dasd');
		createToast(e.target.getAttribute('class'))
	})
})

const toasts = {
	success: {
		icon: '<i class="fas fa-check-circle"></i>',
		msg: 'Thành công !',
	},
	error: {
		icon: '<i class="fas fa-exclamation-triangle"></i>',
		msg: 'Lỗi !',
	},
	warning: {
		icon: '<i class="fas fa-exclamation-circle"></i>',
		msg: 'Không hợp lệ !',
	},
}

function createToast(status) {
	let toast = document.createElement('div')
	toast.className = `toast success`

	toast.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span class="msg">Thành công !</span>
    <span class="countdown"></span>
    `
	document.querySelector('#toasts').appendChild(toast)

	setTimeout(() => {
		toast.style.animation = 'hide_slide 1s ease forwards'
	}, 2000)
	setTimeout(() => {
		toast.remove()
	}, 3000)
}
