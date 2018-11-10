$(function() {
    // constants
    var JDK_MAJOR = "11";
    var JFX_MAJOR = "11";
    
    var JDK_VERSION = "11.0.1";
    var JFX_VERSION = "11.0.1";
    
    var SAMPLES = "https://github.com/openjfx/samples/blob/master";
    
    // Hide all non-active div
    $('.hidden').hide();
    
    // Navigate to anchor if the url has hash
    var anchorHash = window.location.hash;
    if (anchorHash.length > 1) {
        loadContent($('a[href="' + anchorHash + '"]'));
    }
    
    // Make sure correct anchor links are loaded when url changes
    $(window).bind('hashchange', function () {
        var hash = window.location.hash.slice(1);
        loadContent($('a[href="#' + hash + '"]'));
        scrollTo(0, 0);
    });
    
    // Click on anchor links should load content
    $('a[href^="#"]').on('click', function() {
        // TODO: Has performance issues
        // $('a[data-toggle="collapse"][class!="collapsed"]').click();
        var childNode = $(this).find('[href$="-plugin"]');
        if (childNode != null) {
            var dataParent = $(this).attr('data-parent');
            if (dataParent == null) {
                var href = $(this).attr('href');
                var dp = $('a[href="' + href + '"]').not(this).attr('data-parent');
                if (dp != null) {
                    // TODO: shouldn't close when already open
                    $('a[href="' + dp + '"][data-parent="' + dp + '"]').click();
                }
            }
        }
        loadContent(this);
    });
    
    // open group, close rest of groups
    $(".list-group-item .ref-group").click(function(e) {
        e.preventDefault();
        var $target = $(this).closest('li').find("ul.list-group-sub").slideToggle();
        $('html,body').scrollTop(0);
        $('ul.list-group-sub').not($target).slideUp();
    });
    // close opened groups
    $(".list-group-item").click(function(e) {
        if (! $(this).children().length > 0) {
            $('ul.list-group-sub').slideUp();
        }
    });
    
    // Add href to report a problem buttons
    /*$('a[data-section]').each(function() {
        var emailWithSubject = "https://gluonhq.com/about-us/contact-us/?comment=" + 
            encodeURIComponent("Problem with Getting Started in section '") +
            encodeURIComponent($(this).attr('data-section') + "'") +
            encodeURIComponent("\n\nDescribe the problem: ");
        $(this).attr('href', emailWithSubject);
    });*/
    $('a[data-section]').each(function() {
        $(this).attr('href', 'https://github.com/openjfx/openjfx-docs/issues');
    });

    // All tabs showing code should be linked
    $(document).on('click', 'a[class="nav-link"][data-toggle="tab"]', function(e) {
        e.preventDefault();
        var href = $(this).attr('href');
        var os = href.split("-")[0]; // #win or #nix
        $('a[class="nav-link"][data-toggle="tab"][href^="' + os + '"]').each(function() {
            $(this).tab('show');
        });
    });
    
    // Scroll to anchor from list-group-sub links
    $(document).on('click', ".scrollto", function(event) {
        event.preventDefault(); 
        var anchor = $(this).attr('data-scroll');
//        $('html,body').animate({ scrollTop: $(anchor).offset().top }, 500); 
        $('html,body').scrollTop($(anchor).offset().top);
    });
    
    // Replace all constants
    // sticky sidenav
    $(document).ready(function() {
        $('.JDK_MAJOR').each(function() { $(this).text(JDK_MAJOR) });
        $('.JFX_MAJOR').each(function() { $(this).text(JFX_MAJOR) });
        $('.JDK_VERSION').each(function() { $(this).text(JDK_VERSION) });
        $('.JFX_VERSION').each(function() { $(this).text(JFX_VERSION) });
        $('.samples').each(function() { $(this).attr("href", SAMPLES + $(this).attr('href')); });
        
        var div_top = $('.content').offset().top;
        $(window).scroll(function() {
            var windowTop = $(window).scrollTop();
            if (windowTop > div_top) {
                $('.sidenav').css('top', windowTop);  
            } else {
                $('.sidenav').css('top', div_top);  
            } 
        });
    });

    // TODO: Find a better lib to include local html files
    // Because we are using the csi js lib to include the pages,
    // this doesn't work on document ready
    
    // Replace all $ with non-selectable span
    setTimeout(function() {
        $('code').each(function () {
            var content = $(this).html();
            var unselectableContent  = replaceAll(content, "$ ", "<span class=\"no-select\">$ </span>");
            $(this).html(unselectableContent);
        });
    }, 1000);

    // Load content
    function loadContent(hyperlink) {
        // Activate link only if there aren't parent nodes
        var dataRemote = $(hyperlink).attr('data-remote');
        if (dataRemote == null) {
            
            var target = $(hyperlink).attr('href');
            if (target != null) {

                // Show div and hide all siblings
                $(target).show().siblings(".content div").hide();

                // Remove active from all links in nav-bar
                $('a[class*="list-group-item"]').removeClass("active");
                // Remove active from all links in nav-bar
                $('li[class*="list-group-item"]').removeClass("active");
                
                if ($(hyperlink).hasClass('list-group-item')) {
                    $(hyperlink).addClass("active");
                } else if ($(hyperlink).parent(".checked").hasClass('list-group-item')) {
                    $(hyperlink).parent(".checked").addClass("active");
                }
            }
        }
    }
    
    function replaceAll(str, find, replace) {
        return str.split(find).join(replace);
    }
});
