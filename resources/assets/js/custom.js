(function ($) {
	
	"use strict";

	$(function() {
        $("#tabs").tabs();
    });

	$(window).scroll(function() {
	  var scroll = $(window).scrollTop();
	  var box = $('.header-text').height();
	  var header = $('header').height();

	  if (scroll >= box - header) {
	    $("header").addClass("background-header");
	  } else {
	    $("header").removeClass("background-header");
	  }
	});
	

	$('.schedule-filter li').on('click', function() {
        var tsfilter = $(this).data('tsfilter');
        $('.schedule-filter li').removeClass('active');
        $(this).addClass('active');
        if (tsfilter == 'all') {
            $('.schedule-table').removeClass('filtering');
            $('.ts-item').removeClass('show');
        } else {
            $('.schedule-table').addClass('filtering');
        }
        $('.ts-item').each(function() {
            $(this).removeClass('show');
            if ($(this).data('tsmeta') == tsfilter) {
                $(this).addClass('show');
            }
        });
    });


	// Window Resize Mobile Menu Fix
	mobileNav();


	// Scroll animation init
	window.sr = new scrollReveal();
	

	// Menu Dropdown Toggle
	if($('.menu-trigger').length){
		$(".menu-trigger").on('click', function() {	
			$(this).toggleClass('active');
			$('.header-area .nav').slideToggle(200);
		});
	}


	$(document).ready(function () {
	    $(document).on("scroll", onScroll);
	    
	    //smoothscroll
	    $('.scroll-to-section a[href^="#"]').on('click', function (e) {
	        e.preventDefault();
	        $(document).off("scroll");
	        
	        $('a').each(function () {
	            $(this).removeClass('active');
	        })
	        $(this).addClass('active');
	      
	        var target = this.hash,
	        menu = target;
	       	var target = $(this.hash);
	        $('html, body').stop().animate({
	            scrollTop: (target.offset().top) + 1
	        }, 500, 'swing', function () {
	            window.location.hash = target;
	            $(document).on("scroll", onScroll);
	        });
	    });
	});

	function onScroll(event){
	    var scrollPos = $(document).scrollTop();
	    $('.nav a').each(function () {
	        var currLink = $(this);
	        var refElement = $(currLink.attr("href"));
	        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
	            $('.nav ul li a').removeClass("active");
	            currLink.addClass("active");
	        }
	        else{
	            currLink.removeClass("active");
	        }
	    });
	}


	// Page loading animation
	 $(window).on('load', function() {

        $('#js-preloader').addClass('loaded');

    });


	// Window Resize Mobile Menu Fix
	$(window).on('resize', function() {
		mobileNav();
	});


	// Window Resize Mobile Menu Fix
	function mobileNav() {
		var width = $(window).width();
		$('.submenu').on('click', function() {
			if(width < 767) {
				$('.submenu ul').removeClass('active');
				$(this).find('ul').toggleClass('active');
			}
		});
	}
	//Colap
	//Bai 2
	$('#collapseExample2').on('hide.bs.collapse', function () {
  	 	document.getElementById("collapse2").innerHTML = "Xem các bài học";
	})
	$('#collapseExample2').on('show.bs.collapse', function () {
  	 	document.getElementById("collapse2").innerHTML = "Thu gọn";
	})
	//Bai 1

	$('#collapseExample1').on('hide.bs.collapse', function () {
  	 	document.getElementById("collapse1").innerHTML = "Xem các bài học";
	})
	$('#collapseExample1').on('show.bs.collapse', function () {
  	 	document.getElementById("collapse1").innerHTML = "Thu gọn";
	})
	//Bai 3
	$('#collapseExample3').on('hide.bs.collapse', function () {
  	 	document.getElementById("collapse3").innerHTML = "Xem các bài học";
	})
	$('#collapseExample3').on('show.bs.collapse', function () {
  	 	document.getElementById("collapse3").innerHTML = "Thu gọn";
	})
	//Bai 4
	$('#collapseExample4').on('hide.bs.collapse', function () {
  	 	document.getElementById("collapse4").innerHTML = "Xem các bài học";
	})
	$('#collapseExample4').on('show.bs.collapse', function () {
  	 	document.getElementById("collapse4").innerHTML = "Thu gọn";
	})
	//Bai 5
	$('#collapseExample5').on('hide.bs.collapse', function () {
  	 	document.getElementById("collapse5").innerHTML = "Xem các bài học";
	})
	$('#collapseExample5').on('show.bs.collapse', function () {
  	 	document.getElementById("collapse5").innerHTML = "Thu gọn";
	})
	//Bai 6
	$('#collapseExample6').on('hide.bs.collapse', function () {
  	 	document.getElementById("collapse6").innerHTML = "Xem các bài học";
	})
	$('#collapseExample6').on('show.bs.collapse', function () {
  	 	document.getElementById("collapse6").innerHTML = "Thu gọn";
	})

	//Từ điển

	$('#dictionary').on('change keydown paste input',function(){
		document.getElementById('result-search').innerHTML= "T > K";
		if( $('#dictionary').val()!=""){
			document.getElementById('stenoKey1-13').style.backgroundColor="red";
		}
		if( $('#dictionary').val()==""){
			document.getElementById('result-search').innerHTML= "";
		}
	})


})(window.jQuery);