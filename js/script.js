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

  // GSAP animations
  gsap.from('.jumbotron img', { duration: 1, y: -50, opacity: 0, ease: 'bounce' });
  gsap.from('.jumbotron h1', { duration: 1, x: -200, opacity: 0, delay: 0.5 });
  gsap.from('.jumbotron p', { duration: 1, x: 200, opacity: 0, delay: 1 });
  gsap.from('.navbar', { duration: 1, y: -50, opacity: 0, ease: 'power2.out' });
  gsap.from('.about h2', { duration: 1, y: 50, opacity: 0, delay: 1.5 });
  gsap.from('.about p', { duration: 1, y: 50, opacity: 0, delay: 2 });
  gsap.from('.portfolio h2', { duration: 1, y: 50, opacity: 0, delay: 2.5 });
  gsap.from('.portfolio .thumbnail', { duration: 1, y: 50, opacity: 0, delay: 3, stagger: 0.2 });
  gsap.from('.contact h2', { duration: 1, y: 50, opacity: 0, delay: 3.5 });
  gsap.from('.contact-iframe', { duration: 1, y: 50, opacity: 0, delay: 4 });