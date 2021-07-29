// ==UserScript==
// @name         Myth-Weavers DND 5e to Star Wars 5e
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adapt Myth-Weavers' DND 5e character sheet to Star Wars 5e
// @author       BlackPhoenix
// @match        https://www.myth-weavers.com/sheet.html
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
// ==/UserScript==

(function() {
    'use strict';

    // Because Myth-Weavers' own scripts need to run first, we'll run this one with a 2 seconds delay.
    setTimeout(function() {
        // Validate that we are working on a DND 5e sheet:
        if(document.title.includes(":: Dungeons & Dragons 5e ::") &&
            document.getElementsByName("deity")[0].value.toUpperCase() == "STAR WARS") {

            // Change "Cantrips" to "At-Will"
            var cantrips = document.getElementById("cantrips");
            cantrips.innerHTML = "<h2>0<br><small>At-Will</small></h2>";

            // Change the Level 1 "Slots / Expanded" into "Force Points / Max"
            var spellbook = document.getElementById("spellbook");
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

            // Skills:
            // History becomes Lore
            // Arcana becomes Technology
            // Religion becomes Piloting
            var x = document.getElementsByName("history_cc")[0];
            x.nextSibling.nextSibling.textContent = "Lore";
            x = document.getElementsByName("arcana_cc")[0];
            x.nextSibling.nextSibling.textContent = "Technology";
            x = document.getElementsByName("religion_cc")[0];
            x.nextSibling.nextSibling.textContent = "Piloting";
        }
    }, 2000);
})();
