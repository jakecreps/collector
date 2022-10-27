$(function () {
    var url = window.location.href;
    if (url.includes("t.me")) {
        var ret = url.replace('/s','');
        var ret2 = ret.replace(/[0-9]/g, '');
        if (ret2.includes("?")) {
            var ret3 = ret2.split('?');
            console.log(ret3);
            var current_url = ret3[0];
        }else{
            var current_url = ret2;
        }
    }else{
        var current_url = window.location.href;
    }
    if (!current_url.includes("google.com")) {
        get_data(current_url);
        setInterval(function () {
            get_data(current_url);
        }, 30000);
    }
});

function get_data(current_url) {
    chrome.storage.local.get(['items'], function (data) {
        let items = [];
        if (data['items'] && (data['items'] != 'undefined'))
            items = data['items'];
        let date = new Date().toISOString().slice(0, 10);
        let emails = get_emails();
        for (let i = 0; i < emails.length; i++) {
            let item = [];
            let email = emails[i];
            if (!is_included(items, email)) {
                item.push(email);
                item.push(get_password(email));
                item.push(current_url);
                item.push(date);
                items.push(item);
            }
            console.log('data-fetching........');
        }
        chrome.storage.local.set({
            items: items
        });
    });
}
function get_password(email) {
    let page_content = get_page_text_content();
    var regex = new RegExp("("+email+"+:[a-zA-Z0-9._@-]+)", 'gi');
    let password = page_content.match(regex);
    if (password) {
        const password2 = password[0].split(":");
        const password3 = password2[1];
        if (password3) {
            return password3;
        }
    }
    return '-';
}
function get_emails() {
    let emails = [];
    let page_content = get_page_text_content();
    emails = unique_items(page_content.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi));
    emails = filter_emails(emails);

    return emails;
}

function unique_items(items) {

    if (items == null) {
        items = [];
    }

    let unique_items = new Array();

    for (let i = 0; i < items.length; i++) {
        if (!unique_items.includes(items[i])) {
            unique_items.push(items[i]);
        }
    }

    return unique_items;
}

function filter_emails(emails) {

    let filtered_emails = [];
    let current_url = window.location.href;
    current_url = current_url.toLowerCase();

    for (let i = 0; i < emails.length; i++) {
        let email_parts = emails[i].split("@");
        let email_parts1 = email_parts[1].toLowerCase();
        if (!current_url.includes(email_parts1)) {
            filtered_emails.push(emails[i]);
        }
    }

    return filtered_emails;
}

function is_included(items, email) {

    for (var i = 0; i < items.length; i++) {
        if (items[i][0] == email) {
            return true;
        }
    }

    return false;
}

function get_page_text_content() {
    $("body").append('<div id="eps_temp_container"></div>');
    $("#eps_temp_container").html($("body").html());
    $("#eps_temp_container :hidden").remove();
    let page_content = $("#eps_temp_container").html();
    $("#eps_temp_container").remove();
    let current_url = window.location.href;
    if (current_url.includes("pastehub.net")) {
        page_content = page_content.replace(/</g, ' <');
        page_content = page_content.replace(/>/g, '> ');
    }else{
        page_content = page_content.replace(/</g, '<');
        page_content = page_content.replace(/>/g, '>');
    }
    page_content = page_content.replace(/<br\s*\/?>/gi,' ');
    page_content = $(page_content).text();
    page_content = page_content.replace(/  +/g, ' ');
    page_content = page_content.replace(/‐/g, "-");
    page_content = page_content.replace(/\n/g, " ");

    return page_content;
}
