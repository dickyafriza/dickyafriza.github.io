// Smooth scroll for links with class 'page-scroll'
$('.page-scroll').on('click', function(e) {
	// Prevent default anchor click behavior
	e.preventDefault();
  
	// Store hash
	var hash = this.hash;
  
	// Using jQuery's animate() method to add smooth page scroll
	$('html, body').animate({
	  scrollTop: $(hash).offset().top
	}, 800, function(){
	  window.location.hash = hash;
	});
  });
  
  // Parallax effect
  $(window).scroll(function() {
	var wScroll = $(this).scrollTop();
  
	$('.jumbotron img').css({
	  'transform': 'translate(0px, ' + wScroll / 4 + '%)',
	  'z-index': wScroll > 0 ? 0 : 1
	});
  
	$('.jumbotron h1').css({
	  'transform': 'translate(0px, ' + wScroll / 2 + '%)',
	  'z-index': wScroll > 0 ? 0 : 1
	});
  
	$('.jumbotron p').css({
	  'transform': 'translate(0px, ' + wScroll / 1.2 + '%)',
	  'z-index': wScroll > 0 ? 0 : 1
	});
  
	// Portfolio animation
	if (wScroll > $('.portfolio').offset().top - 600) {
	  $('.portfolio .thumbnail').each(function(i) {
		setTimeout(function() {
		  $('.portfolio .thumbnail').eq(i).addClass('muncul');
		}, 180 * (i + 1));
	  });
	}

	// Toggle navbar class on scroll
	if (wScroll > 50) {
	  $('.navbar').addClass('scrolled');
	} else {
	  $('.navbar').removeClass('scrolled');
	}
  });
  
  // Update year in footer
  document.getElementById('year').textContent = new Date().getFullYear();