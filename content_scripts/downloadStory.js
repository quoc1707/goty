/**
 *
 * @param {string} username
 * @param {string} story
 */
function savePhotoStory(username, url) {
    chrome.runtime.sendMessage(null, {
        site: 'facebook',
        username,
        url,
    })
}

/**
 *
 * @param {HTMLImageElement | null} profile_picture
 * @param {boolean} is_viewing_story
 */
function downloadStory(profile_picture, is_viewing_story) {
    if (profile_picture && is_viewing_story) {
        const username = profile_picture.alt
        const url = document.head.getAttribute('data-story-url')

        let story = document.querySelectorAll('img[draggable=false]')
        let videos = document.querySelectorAll('video')
        /**
         * @type HTMLVideoElement | null
         */
        let video = null

        for (const vid of videos) if (vid.offsetHeight !== 0) video = vid

        if (story && (!video || url === 'null'))
            savePhotoStory(username, story[story.length - 1].src)
        else {
            chrome.runtime.sendMessage(null, {
                site: 'facebook',
                username,
                url,
            })
            document.head.removeAttribute('data-story-url')
        }
    }
    // case when user accidentally clicks on the extension while he/she is not viewing any story
    else chrome.runtime.sendMessage(null, { noStoryAvailable: true })
}

downloadStory(
    document.querySelector(
        "a[role=link][tabindex='0'][href*='https://www.facebook']>img"
    ),
    window.location.href.indexOf('stories') !== -1
)
