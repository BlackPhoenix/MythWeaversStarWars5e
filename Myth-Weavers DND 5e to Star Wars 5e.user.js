// ==UserScript==
// @name         Myth-Weavers DND 5e to Star Wars 5e
// @namespace    http://tampermonkey.net/
// @version      0.45
// @description  Adapt Myth-Weavers' DND 5e character sheet to Star Wars 5e
// @author       BlackPhoenix
// @match        https://www.myth-weavers.com/sheet.html
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        none
// @supportURL   https://github.com/BlackPhoenix/MythWeaversStarWars5e/issues
// @homepageURL  https://github.com/BlackPhoenix/MythWeaversStarWars5e
//
// This script will trigger only if:
//   - the sheet is for DND 5e
//   - the diety value is "Star Wars" (not case-sensitive)
//
// Changelog:
// 2021/07/28:  Changed check of the diety value to be case-insensitive
// 2021/08/03:  Complete re-write using waitForKeyElements rather than a timeout
// 2021/08/18:  Added validating that this is a D&D 5e sheet using the document title
// ==/UserScript==

// Wait for the deity input to be available, then go from there.
waitForKeyElements(
    "input[name='deity']",
    StartConversion
    );

function StartConversion(jNode) {
    if(document.title.includes(":: Dungeons & Dragons 5e ::")) {
        // Check that deity contains "Star Wars"
        if(jNode[0].value.toUpperCase() == "STAR WARS") {
            // It does, so let's fire the various changes once the relevant elements are there (which should be immediate)
            waitForKeyElements("#cantrips", ChangeCantrips);
            waitForKeyElements("input[name='history_cc']", HistoryToLore);
            waitForKeyElements("input[name='arcana_cc']", ArcanaToTechnology);
            waitForKeyElements("input[name='religion_cc']", ReligionToPiloting);
            waitForKeyElements("#spellbook", Spellbook);
        }
    }
}

// Change "Cantrip" to "At-Will"
function ChangeCantrips(jNode) {
    jNode[0].innerHTML = "<h2>0<br><small>At-Will</small></h2>";
}

// Rename skill "History" to "Lore"
function HistoryToLore(jNode) {
    jNode[0].nextSibling.nextSibling.textContent = "Lore";
}

// Rename skill "Arcana" to "Technology"
function ArcanaToTechnology(jNode) {
    jNode[0].nextSibling.nextSibling.textContent = "Technology";
}

// Rename skill "Religion" to "Piloting"
function ReligionToPiloting(jNode) {
    jNode[0].nextSibling.nextSibling.textContent = "Piloting";
}

function Spellbook(jNode) {
    // Change the Level 1 "Slots / Expanded" into "Force Points / Max"
    var spellbook = jNode[0]
    var lvl1slots = spellbook.getElementsByClassName("span4")[0].getElementsByTagName("small")[0];
    lvl1slots.childNodes[0].data = "Force Points";
    lvl1slots.childNodes[2].data = "Max";

    // Change the Level 3 "Slots / Expanded" into "Tech Points / Max"
    var lvl3slots = spellbook.getElementsByClassName("span4")[2].getElementsByTagName("small")[0];
    lvl3slots.childNodes[0].data = "Tech Points";
    lvl3slots.childNodes[2].data = "Max";

    // Hide the Slots / Expanded from level 2
    spellbook.getElementsByClassName("span4")[1].getElementsByTagName("small")[0].style.display = "none";

    // Hide the Slots / Expanded from levels 4 to 9
    for (var i = 3; i <= 8; i++) {
        spellbook.getElementsByClassName("span4")[i].getElementsByTagName("small")[0].style.display = "none";
    }

    // Hide the "Prepared" line under each spell level's header
    var preparedList = spellbook.getElementsByClassName("prepared");
    for (i = 0; i < preparedList.length; i++) {
        preparedList[i].style.display = "none";
    }
}
