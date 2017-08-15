import 'jquery-query-object';
import Cookies from 'js-cookie';

$(document).ready(function(){

    /* Portfolio carousel */
    $(".carousel").swipe({
	swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
	    if (direction == 'left') $(this).carousel('next');
	    if (direction == 'right') $(this).carousel('prev');

	},
	allowPageScroll:"vertical"
    });

    /* Subscribed notification */
    /* 
    var notification = $.query.get('notification');
    if (notification == "subscribed") {
	$(".alert").show();
	console.log("Subscription box closed!");
	Cookies.set('subscription_box_closed', 'yes', { expires: 500 });
	$(".alert").delay(3000).fadeOut();	
    }
    */

    /* Set src cookie */
    var source = $.query.get('src');
    if (source) {
	Cookies.set('src', source, { expires: 10 });	
    } else {
	/* If there's no src in url, try getting source from cookies */
	source = Cookies.get('src');
    }
    if (source) {
	$("#email-src").val(source);
	$("#email-src-modal").val(source);
	$("#email-src-newsletter").val(source);					
    }

    

    /* Google Analytics */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			     m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-44003603-25', 'auto');
    ga('send', 'pageview');
});

