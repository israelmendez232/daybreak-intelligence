jQuery(document).ready(function(){
	"use strict";

    jQuery('#current_sidebar li a.sidebar_del').on( 'click', function(){
    	if(confirm('Are you sure you want to delete this sidebar? (this can not be undone)'))
    	{
    		sTarget = jQuery(this).attr('href');
    		sSidebar = jQuery(this).attr('rel');
    		objTarget = jQuery(this).parent('li');
    		
    		jQuery.ajax({
        		type: 'POST',
        		url: sTarget,
        		data: 'sidebar_id='+sSidebar,
        		success: function(msg){ 
        			objTarget.fadeOut();
        			setTimeout(function() {
                      location.reload();
                    }, 1000);
        		}
        	});
    	}
    	
    	return false;
    });
    
    jQuery('a.image_del').on( 'click', function(){
    	if(confirm('Are you sure you want to delete this image? (this can not be undone)'))
    	{
    		sTarget = jQuery(this).attr('href');
    		sFieldId = jQuery(this).attr('rel');
    		objTarget = jQuery('#'+sFieldId+'_wrapper');
    		
    		jQuery.ajax({
        		type: 'POST',
        		url: sTarget,
        		data: 'field_id='+sFieldId,
        		success: function(msg){ 
        			objTarget.fadeOut();
        			jQuery('#'+sFieldId).val('');
        		}
        	});
    	}
    	
    	return false;
    });
    
    jQuery('#pp_panel a').on( 'click', function(){
    	jQuery('#pp_panel a').removeClass('nav-tab-active');
    	jQuery(this).addClass('nav-tab-active');
    	
    	jQuery('.rm_section').css('display', 'none');
    	jQuery(jQuery(this).attr('href')).fadeIn();
    	jQuery('#current_tab').val(jQuery(this).attr('href'));
    	
    	return false;
    });
	
	var elems = document.querySelectorAll('.iphone_checkboxes');

	for (var i = 0; i < elems.length; i++) {
	  var switchery = new Switchery(elems[i], { color: '#0073aa', size: 'small' });
	}
		
	jQuery('.rm_section').css('display', 'none');
    
    //if URL has #
    if(self.document.location.hash != '')
	{
		//Check if Instagram request
		var stringAfterHash = self.document.location.hash.substr(1);
		var hashDataArr = stringAfterHash.split('=');
		
		//If not access token
		if(hashDataArr[0] != 'access_token')
		{
		    jQuery('html, body').stop().animate({scrollTop:0}, 'fast');
		    jQuery('.nav-tab').removeClass('nav-tab-active');
		    jQuery('a'+self.document.location.hash+'_a').addClass('nav-tab-active');
		    jQuery('div'+self.document.location.hash).css('display', 'block');
		    jQuery('#current_tab').val(self.document.location.hash);
		}
		else
		{
			var instagarmAccessToken = hashDataArr[1];
			jQuery('#pp_instagram_access_token').val(instagarmAccessToken);
			
			jQuery('.nav-tab').removeClass('nav-tab-active');
		    jQuery('a#pp_panel_social-profiles_a').addClass('nav-tab-active');
		    jQuery('div#pp_panel_social-profiles').css('display', 'block');
		    jQuery('#current_tab').val('#pp_panel_social-profiles');
		    
		    setTimeout(function() {
				jQuery('#save_ppsettings').trigger('click');
            }, 500);
		}
	}
	else
	{
	    jQuery('div#pp_panel_home').css('display', 'block');
	}
    
    jQuery( ".pp_sortable" ).sortable({
	    placeholder: "ui-state-highlight",
	    create: function(event, ui) { 
	    	myCheckRel = jQuery(this).attr('rel');
	    
	    	var order = jQuery(this).sortable('toArray');
        	jQuery('#'+myCheckRel).val(order);
	    },
	    update: function(event, ui) {
	    	myCheckRel = jQuery(this).attr('rel');
	    
	    	var order = jQuery(this).sortable('toArray');
        	jQuery('#'+myCheckRel).val(order);
	    }
	});
	jQuery( ".pp_sortable" ).disableSelection();
	
	jQuery(".pp_checkbox input").change(function(){
	    myCheckId = jQuery(this).val();
	    myCheckRel = jQuery(this).attr('rel');
	    myCheckTitle = jQuery(this).attr('alt');
	    
	    if (jQuery(this).is(':checked')) { 
	    	jQuery('#'+myCheckRel).append('<li id="'+myCheckId+'_sort" class="ui-state-default">'+myCheckTitle+'</li>');
	    } 
	    else
	    {
	    	jQuery('#'+myCheckId+'_sort').remove();
	    }

	    var order = jQuery('#'+myCheckRel).sortable('toArray');

        jQuery('#'+myCheckRel+'_data').val(order);
	});
	
	jQuery(".pp_sortable_button").on( 'click', function(){
	    var targetSelect = jQuery('#'+jQuery(this).attr('data-rel'));
	    
	    myCheckId = targetSelect.find("option:selected").val();
	    myCheckRel = targetSelect.find("option:selected").attr('data-rel');
	    myCheckTitle = targetSelect.find("option:selected").attr('title');

	    if (jQuery('#'+myCheckRel).children('li#'+myCheckId+'_sort').length == 0)
	    {
	    	jQuery('#'+myCheckRel).append('<li id="'+myCheckId+'_sort" class="ui-state-default"><div class="title">'+myCheckTitle+'</div><a data-rel="'+myCheckRel+'" href="javascript:removeSortRecord(\''+myCheckId+'\', \''+myCheckRel+'\');" class="remove">x</a><br style="clear:both"/></li>');
	    	//jQuery('#'+myCheckId+'_sort').remove();
	    	
	    	var order = jQuery('#'+myCheckRel).sortable('toArray');
        	jQuery('#'+myCheckRel+'_data').val(order);
        }
        else
        {
        	alert('You have already added "'+myCheckTitle+'"');
        }
	});
	
	jQuery(".pp_sortable li a.remove").on( 'click', function(){
	    jQuery(this).parent('li').remove();
	    var order = jQuery('#'+jQuery(this).attr('data-rel')).sortable('toArray');
        jQuery('#'+jQuery(this).attr('data-rel')+'_data').val(order);
	});
    
    jQuery("input.upload_text").on( 'click', function() { jQuery(this).select(); } );
	
	//Import selected demo templates
	jQuery("#ppb_demo_pages_wrapper li a.confirm_import").on( 'click', function(){
		if(confirm('Are you sure you want to import this demo page. All current content builder data for this page will be overwrite? (this can not be undone)'))
		{
			//Prepare selected module data
			jQuery('#ppb_demo_pages_wrapper li').removeClass('selected');
			jQuery(this).parent('li').addClass('selected');
			
			var moduleSelectedId = jQuery(this).parent('li').data('module');
			var moduleSelectedTitle = jQuery(this).parent('li').data('title');
			
			jQuery('#ppb_options').val(moduleSelectedId);
			jQuery('#ppb_options_title').val(moduleSelectedTitle);
		    jQuery('#ppb_import_current').val(1);
		    
		    var targetSelect = jQuery('#ppb_options');
		    var demoPageFile = jQuery('#ppb_demo_page_'+targetSelect.val()).data('file');
		    
		    jQuery('#ppb_import_demo_file').val(demoPageFile);
		    jQuery('#ppb_import_current_button').trigger('click');
		}
	});
	
	jQuery('#import_demo li').on( 'click', function(){
	    jQuery('#import_demo li').removeClass('selected');
	    jQuery(this).addClass('selected');
	    
	    var selectedDemo = jQuery(this).data('demo');
	    jQuery('#pp_import_demo').val(selectedDemo);
	});
	
	jQuery('#import_demo_content li').on( 'click', function(){
	    jQuery('#import_demo_content li').removeClass('selected');
	    jQuery(this).addClass('selected');
	    
	    var selectedDemo = jQuery(this).data('demo');
	    jQuery('#dotlife_import_demo_content').val(selectedDemo);
	});
	
	jQuery('.pp_import_content_button').on( 'click', function(){
		if(jQuery(this).data('demo')=='')
		{
			alert('Please select demo content you want to import');
			return false;
		}
		
		var selectDemo = jQuery(this).data('demo');
		var wpNonce = jQuery(this).data('nonce');
	
	    import_true = confirm('Installing demo content will not alter any of your current pages or posts, but it will overwrite your Customizer settings. This is not reversible unless you have previously made a backup of your settings. Are you sure you want to proceed?');
        if(import_true == false) return;

        jQuery('.import_message').show();
       
        var data = {
            'action': 'dotlife_import_demo_content',
            'demo': selectDemo,
            '_wpnonce': wpNonce,
        };

        jQuery.post(ajaxurl, data, function(response) {
            jQuery('.import_message').html('<div class="import_message_success"><span class="dashicons dashicons-yes"></span>All done.</div>');
            jQuery('.import_message').addClass('clickable');
            jQuery('.import_message.clickable').on( 'click', function(e){
				jQuery(this).hide();
			});
        });
	});
	
	//Custom functions for handle page options box
	var postType = jQuery('#page_header_type').val();
	switch(postType) 
	{
	    case 'Vimeo Video':
	        jQuery('#page_option_page_header_vimeo').show();
	        jQuery('#page_option_page_header_youtube').hide();
	    break;
	    
	    case 'Youtube Video':
	        jQuery('#page_option_page_header_youtube').show();
	        jQuery('#page_option_page_header_vimeo').hide();
	    break;
	    
	    case 'Image':
	        jQuery('#page_option_page_header_vimeo').hide();
	        jQuery('#page_option_page_header_youtube').hide();
	    break;
	}
	
	jQuery('#page_header_type').on( 'change', function(){
		var postType = jQuery(this).val();
		switch(postType) 
		{
		    case 'Vimeo Video':
		        jQuery('#page_option_page_header_vimeo').show();
		        jQuery('#page_option_page_header_youtube').hide();
		    break;
		    
		    case 'Youtube Video':
		        jQuery('#page_option_page_header_youtube').show();
		        jQuery('#page_option_page_header_vimeo').hide();
		    break;
		    
		    case 'Image':
		        jQuery('#page_option_page_header_vimeo').hide();
		        jQuery('#page_option_page_header_youtube').hide();
		    break;
		}
	});
	
	if(jQuery('body').hasClass('post-type-footer'))
	{
		jQuery('#page_template').children('option[value="elementor_canvas"]').prop('selected',true);
		jQuery('#pageparentdiv').hide();
	}
	
	if(jQuery('body').hasClass('post-type-header'))
	{
		jQuery('#page_template').children('option[value="elementor_canvas"]').prop('selected',true);
		jQuery('#pageparentdiv').hide();
	}
});