		var active = -1;
		var total_topics;
		var interval_ms = 10000;
		var Timer;
		var TotalSeconds;
		var started = false;
		var can_start = true;
		var interval_int;
		var beep_high;
		var beep_low;
		var fail_horn;
		
		$(function(){
		
				beep_high = new Audio("wav/beep-7.wav");
				beep_low = new Audio("wav/beep-8.wav");
				fail_horn = new Audio("wav/fail_horn.wav");
		
			$(document).keyup(function(evt) {
				if (evt.keyCode == 32 && !started && can_start) {
					started = true;
					$('.nav').hide();
					CreateTimer("timer");
					$('.timer').textfill({ maxFontPixels: 1000, innerTag: 'span#timer' });
					evt.stopPropagation();
				}

				// using can_start to indicate if we are editing a topic
				if (evt.keyCode == 13 && !started && !can_start) {
					var txt = $('input:focus');
					var next = txt.parent().parent().next().find('span');
					
					txt.blur();
					next.trigger('click');
				}
			});
			
			$('a.add-btn').click(function(){
				$('.topic-list').append("<li class='editable'><span>New Topic</span><a class='remove'><i class='icon-white icon-remove'></i></a></li>");
				$('.editable span').editable('destroy').editable({
					onEdit: function() { can_start=false; },
					onSubmit: function() { can_start = true;}
				});
			})
			
			$(window).resize(function(){
				$('.timer').textfill( { maxFontPixels: 1000, innerTag: 'span#timer'  } )
			});
			
			$('a.remove').live('click', function(){
				$(this).parent().remove();
			});
			
			$('.topic-list li').live('hover', function(){
				$(this).find('a.remove').toggle();
			});

			$('.editable span').editable({
				onEdit: function() { can_start=false; $('input:focus').select(); },
				onSubmit: function() { can_start = true;}
			});
			
			$('.test').click(function(){			
				beep_high.play();
			});			
			
		});
		
		
		function CreateTimer(timer_id){
			interval_ms = $('.interval').val() * 1000;
			Timer = $('#' + timer_id);	
			TotalSeconds = interval_ms/1000;	
			total_topics = $('.topic-list li').length;
			UpdateTimer();
			
			nextActive();
			setTimeout("Tick()", 1000);
		}
		
		function animateBG() {
			$('body').animate( {  backgroundColor: "#454" }, 1).animate( {  backgroundColor: "#451C1C" }, interval_ms);
		}
		
		function nextActive(){
			active++;
			$('.topic-list li.active').removeClass('active');
			$('.topic-list li').eq(active).addClass('active');
			
			$('#current_topic').html( $('.topic-list li').eq(active).html() )
			$('#next_topic').html( 'QUEUED UP: ' + $('.topic-list li').eq(active+1).html() )
			
			if (active == total_topics) {
				TotalTime = 0;
				UpdateTimer();
				GameOver();
			} else {
				beep_low.play();
				animateBG();
			}			
		}
				
		function UpdateTimer(){
			if (TotalSeconds < 0) {
				TotalSeconds = interval_ms/1000;
				nextActive();
			}
		
			$(Timer).html( (TotalSeconds < 10 ? '0' : '') + TotalSeconds );
		}
		
		function GameOver() {
			$('#current_topic').html('GAME OVER')
			$('#next_topic').html('Press SPACEBAR to restart');
			TotalSeconds = 0;
			active = -1;
			started = false;
			$('.nav').show();
			
			fail_horn.play();
		}
		
		function Tick(){
			TotalSeconds--;
			UpdateTimer();
			
			if (TotalSeconds == 2 || TotalSeconds == 1 || TotalSeconds == 0)  beep_high.play();			
			if (active != total_topics && started){ window.setTimeout("Tick()", 1000); }
		}
