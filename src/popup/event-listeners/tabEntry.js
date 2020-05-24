import "Polyfill"
import * as captureTab from "../captureTab"
import { getTabId, selectTabEntry, closeTabEntry } from "../wtdom"

export function selectTab(tabEntry) {
    let tabId = getTabId(tabEntry);
    let currentSelected = document.getElementsByClassName("selected-entry");
    if (currentSelected.length > 0) currentSelected[0].classList.remove("selected-entry");
    tabEntry.classList.add("selected-entry");
    captureTab.captureTab(tabId).then(dataUri => {
        if (dataUri !== null) {
            document.getElementById("details-img").src = dataUri;
        }
        browser.tabs.get(tabId).then(tab => {
            document.getElementById("details-title").textContent = tab.title;
            document.getElementById("details-url").textContent = tab.url;
            document.getElementById("details-placeholder").style.display = "none";
            document.getElementById("tab-details").style.display = "inline-block";
            document.getElementById("tab-details").setAttribute("data-tab_id", tabId);
            if (tab.pinned) {
                document.getElementById("details-pinned").style.display = "inline";
            } else {
                document.getElementById("details-pinned").style.display = "none";
            }
            if (tab.hidden) {
                document.getElementById("details-hidden").style.display = "inline";
            } else {
                document.getElementById("details-hidden").style.display = "none";
            }
            if (tab.pinned && tab.hidden) {
                document.getElementById("details-comma").style.display = "inline";
            } else {
                document.getElementById("details-comma").style.display = "none";
            }
        });
    });
}

export function tabEntryMouseOver(e) {
    selectTab(e.target);
    e.preventDefault();
}

export function tabEntryClicked(e) {
    if (e.button === 0) {
        selectTabEntry(e.target);
    }
}

export function tabCloseClick(e) {
    e.stopPropagation();
    closeTabEntry(e.target.parentElement.parentElement);
}

export function tabPinClick(e) {
    e.stopPropagation();
    let tabId = getTabId(e.target.parentElement.parentElement);
    browser.tabs.get(tabId).then(tab => {
        if (tab.pinned) {
            browser.tabs.update(tab.id, {
                pinned: false
            });
        } else {
            browser.tabs.update(tab.id, {
                pinned: true
            });
        }
    });
}

export function tabSpeakerControlClick(e) {
    e.stopPropagation();
    let tabId = getTabId(e.target.parentElement.parentElement);
    browser.tabs.get(tabId).then(tab => {
        if (tab.mutedInfo.muted) {
            browser.tabs.update(tab.id, {
                muted: false
            });
        } else {
            browser.tabs.update(tab.id, {
                muted: true
            });
        }
    });
}
