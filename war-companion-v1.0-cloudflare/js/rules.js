/* WAR Companion v1.0 — concise reference data derived from the user-provided
   Warhammer 40,000 Core Rules (24.09). These are play aids, not a replacement
   for the complete official rules or later rules updates. */
window.RULES_VERSION = 'Core Rules 24.09';

window.RULES_DATA = [
  {
    id: 'battle-round', title: 'Battle Round and Turn Order', category: 'Battle Flow', page: 10,
    summary: 'Each battle round contains one turn for each player. Every turn follows Command, Movement, Shooting, Charge, then Fight.',
    details: 'The same player takes the first turn in every battle round unless the mission says otherwise. After both players complete a turn, advance to the next battle round.',
    tags: ['round','turn','phase order','command movement shooting charge fight']
  },
  {
    id: 'sequencing', title: 'Simultaneous Rules and Sequencing', category: 'Core Concepts', page: 9,
    summary: 'During a turn, the player whose turn it is chooses the order for rules that resolve at the same time.',
    details: 'Before or after the battle, or at the start or end of a battle round, players roll off and the winner chooses the order.',
    tags: ['same time','simultaneous','order','resolve']
  },
  {
    id: 'unit-coherency', title: 'Unit Coherency', category: 'Core Concepts', page: 6,
    summary: 'Units of 2–6 models must keep every model within 2" horizontally and 5" vertically of at least one other model; units of 7+ require two other models.',
    details: 'A unit must be set up and end every move in coherency. At the end of each turn, remove models one at a time until each unit is a single coherent group. Those removals count as destroyed but do not trigger rules that apply when a model is destroyed.',
    tags: ['coherency','2 inches','5 inches','seven models','end turn']
  },
  {
    id: 'engagement-range', title: 'Engagement Range', category: 'Core Concepts', page: 7,
    summary: 'Models are within Engagement Range when they are within 1" horizontally and 5" vertically of an enemy model.',
    details: 'Models cannot be set up or end a Normal, Advance or Fall Back move within Engagement Range of enemy models.',
    tags: ['1 inch','5 inches','melee','close combat']
  },
  {
    id: 'measure-distance', title: 'Measuring Distances', category: 'Core Concepts', page: 7,
    summary: 'Measure between the closest points of model bases; for a model without a base, measure to the closest part of the model.',
    details: '“Within” includes any distance not greater than the stated distance. Distances may be measured at any time.',
    tags: ['within','inches','bases','distance']
  },
  {
    id: 'visibility', title: 'Visibility and Full Visibility', category: 'Core Concepts', page: 8,
    summary: 'A model is visible if any part can be seen from any part of the observing model. A unit is visible if at least one model is visible.',
    details: 'A model is fully visible when every facing part can be seen. A unit is fully visible only when every model is fully visible. An observing model can see through models in its own unit for visibility checks.',
    tags: ['line of sight','los','visible','fully visible','true line of sight']
  },
  {
    id: 'rerolls', title: 'Re-rolls and Unmodified Rolls', category: 'Core Concepts', page: 9,
    summary: 'A die can never be re-rolled more than once. Re-rolls happen before modifiers.',
    details: 'For a roll made by adding several dice, re-roll all those dice unless the rule states otherwise. An unmodified result is the result after re-rolls but before modifiers.',
    tags: ['reroll','re-roll','unmodified','modifier','2d6']
  },
  {
    id: 'roll-off', title: 'Roll-off', category: 'Core Concepts', page: 9,
    summary: 'Each player rolls one D6; highest wins. Re-roll tied roll-offs.',
    details: 'Roll-off dice cannot be re-rolled or modified.',
    tags: ['roll off','tie','d6']
  },
  {
    id: 'starting-strength', title: 'Starting and Below Half-strength', category: 'Command', page: 12,
    summary: 'For multi-model units, Below Half-strength means fewer than half the starting models remain. A one-model unit is Below Half-strength when its remaining wounds are below half its Wounds characteristic.',
    details: 'Starting Strength is the number of models when the unit is added to the army. Attached units initially combine the Starting Strength of the Leader and Bodyguard units.',
    tags: ['below half strength','starting strength','battle shock','wounds']
  },
  {
    id: 'command-phase', title: 'Command Phase', category: 'Command', page: 11,
    summary: 'First both players gain 1CP and resolve Command phase rules; then the active player takes required Battle-shock tests.',
    details: 'Outside the CP gained at the start of Command phases, each player can gain only 1 additional CP per battle round, regardless of source.',
    tags: ['command','gain cp','command point','battle shock']
  },
  {
    id: 'battle-shock', title: 'Battle-shock Test', category: 'Command', page: 11,
    summary: 'For each Below Half-strength unit on the battlefield, roll 2D6. Pass if the result is at least the unit’s best Leadership; otherwise it is Battle-shocked until your next Command phase.',
    details: 'While Battle-shocked, models in the unit have OC 0, the controlling player cannot use Stratagems to affect the unit, and every model must take a Desperate Escape test if the unit Falls Back.',
    tags: ['battleshock','battle-shocked','leadership','2d6','oc 0']
  },
  {
    id: 'normal-move', title: 'Normal Move', category: 'Movement', page: 13,
    summary: 'Each model may move up to its Move characteristic and cannot move within Engagement Range of enemy models.',
    details: 'The unit must end in Unit Coherency. Measure the path using the part of the base that moved farthest.',
    tags: ['normal move','movement','move characteristic']
  },
  {
    id: 'remain-stationary', title: 'Remain Stationary', category: 'Movement', page: 13,
    summary: 'If a unit Remains Stationary, none of its models can move for the rest of that phase.',
    details: 'This choice may enable rules such as Heavy weapons.',
    tags: ['stationary','heavy','do not move']
  },
  {
    id: 'advance', title: 'Advance', category: 'Movement', page: 14,
    summary: 'Roll one D6 and add it to the unit’s Move characteristic for the phase.',
    details: 'A unit that Advances cannot shoot or declare a charge that turn unless another rule, such as Assault, permits an exception. It cannot end within Engagement Range.',
    tags: ['advance','m+d6','cannot shoot','cannot charge','assault']
  },
  {
    id: 'fall-back', title: 'Fall Back', category: 'Movement', page: 14,
    summary: 'Models move up to their Move characteristic and may pass within Engagement Range, but cannot end within Engagement Range.',
    details: 'A unit that Falls Back cannot shoot or declare a charge that turn unless another rule permits it. Moving over enemy models may require Desperate Escape tests.',
    tags: ['fallback','fall back','cannot shoot','cannot charge','engagement']
  },
  {
    id: 'desperate-escape', title: 'Desperate Escape Test', category: 'Movement', page: 14,
    summary: 'Roll one D6 for each required model; on 1–2, one model from the unit is destroyed.',
    details: 'Tests are required for models moving over enemy models during a Fall Back, except Titanic or Fly models, and for every model in a Battle-shocked unit that Falls Back. A model can trigger only one such test per phase.',
    tags: ['desperate escape','fall back','1-2','destroyed']
  },
  {
    id: 'move-over-terrain', title: 'Moving Over Terrain', category: 'Movement', page: 15,
    summary: 'Models may move over terrain, measuring the actual path up, across and down it.',
    details: 'A model may move through a space only if it can physically fit. Models cannot end a move mid-climb unless the terrain permits placement.',
    tags: ['terrain movement','climb','vertical','path']
  },
  {
    id: 'fly', title: 'Fly', category: 'Movement', page: 15,
    summary: 'When making a Normal, Advance or Fall Back move, a Fly model may move over enemy models as though they were not there.',
    details: 'When starting or ending on terrain, measure the diagonal path through the air. The model still cannot end on another model or within Engagement Range of enemies.',
    tags: ['fly','flying','move over models','diagonal']
  },
  {
    id: 'reinforcements', title: 'Reinforcements and Reserves', category: 'Movement', page: 16,
    summary: 'In the Reinforcements step, set up eligible Reserves units one at a time according to the rule that placed them in Reserves.',
    details: 'A unit set up as Reinforcements counts as having made a Normal move that phase and cannot make another move that phase. Any Reserves unit not set up before the battle ends counts as destroyed.',
    tags: ['reinforcements','reserves','set up','normal move']
  },
  {
    id: 'embark', title: 'Embark', category: 'Transports', page: 17,
    summary: 'After a Normal, Advance or Fall Back move, a unit may embark if every model ends within 3" of a friendly Transport and the unit can fit within its capacity.',
    details: 'Remove the embarked unit from the battlefield. A unit cannot embark and disembark in the same phase.',
    tags: ['transport','embark','within 3']
  },
  {
    id: 'disembark', title: 'Disembark', category: 'Transports', page: 17,
    summary: 'A unit that began the Movement phase embarked may disembark wholly within 3" of its Transport and outside Engagement Range.',
    details: 'If it disembarks before the Transport moves, it can act normally but cannot Remain Stationary. If it disembarks after a Normal move, it cannot move further or charge that turn. It cannot disembark after the Transport Advances or Falls Back.',
    tags: ['transport','disembark','within 3','charge']
  },
  {
    id: 'destroyed-transport', title: 'Destroyed Transport', category: 'Transports', page: 18,
    summary: 'Resolve Deadly Demise first, then surviving embarked units must disembark before the Transport is removed.',
    details: 'Roll one D6 for each disembarking model; each 1 causes one mortal wound to that unit. If models cannot be set up, use Emergency Disembarkation distances and restrictions; models still unable to be set up are destroyed.',
    tags: ['transport destroyed','emergency disembark','mortal wounds']
  },
  {
    id: 'firing-deck', title: 'Firing Deck X', category: 'Transports', page: 17,
    summary: 'When the Transport shoots, select up to X embarked models and one ranged weapon from each.',
    details: 'Until the Transport finishes its attacks, it counts as equipped with the selected weapons in addition to its own.',
    tags: ['firing deck','transport','embarked shooting']
  },
  {
    id: 'shooting-eligibility', title: 'Eligible to Shoot', category: 'Shooting', page: 19,
    summary: 'A unit is generally eligible to shoot unless it Advanced or Fell Back that turn, or is within Engagement Range.',
    details: 'Assault, Pistol, Big Guns Never Tire and other rules can create exceptions. Select one eligible unit at a time and resolve all its shooting before selecting another.',
    tags: ['eligible shoot','advanced','fell back','engagement range']
  },
  {
    id: 'select-targets', title: 'Select Shooting Targets', category: 'Shooting', page: 19,
    summary: 'Declare targets for all ranged weapons before resolving any attacks.',
    details: 'At least one model in the target unit must be visible and in range of the attacking weapon. Different weapons or models may target different units, but attacks from one weapon cannot be split between targets.',
    tags: ['target','visibility','range','split fire']
  },
  {
    id: 'big-guns-never-tire', title: 'Big Guns Never Tire', category: 'Shooting', page: 20,
    summary: 'Monster and Vehicle units may shoot while within Engagement Range and may target enemy units they are engaged with.',
    details: 'When a Monster or Vehicle shoots while within Engagement Range, or targets an enemy unit within Engagement Range of friendly units, subtract 1 from the Hit roll unless the weapon is a Pistol. Blast weapons still cannot target a unit within Engagement Range of friendly units.',
    tags: ['monster','vehicle','shoot in combat','big guns','-1 hit']
  },
  {
    id: 'attack-sequence', title: 'Attack Sequence', category: 'Making Attacks', page: 21,
    summary: 'Resolve each attack through Hit roll, Wound roll, allocate attack, saving throw, then inflict damage.',
    details: 'Attacks are technically resolved one at a time, though fast dice rolling can be used when the relevant characteristics and rules are the same.',
    tags: ['hit wound save damage','attack sequence','fast dice']
  },
  {
    id: 'hit-roll', title: 'Hit Roll', category: 'Making Attacks', page: 21,
    summary: 'Roll one D6. The attack hits if the result equals or exceeds the weapon’s Ballistic Skill or Weapon Skill.',
    details: 'An unmodified 6 is a Critical Hit and always succeeds. An unmodified 1 always fails. Hit-roll modifiers cannot produce a net modifier worse than -1 or better than +1.',
    tags: ['hit','ballistic skill','weapon skill','critical hit','6']
  },
  {
    id: 'wound-roll', title: 'Wound Roll', category: 'Making Attacks', page: 22,
    summary: 'Compare Strength to Toughness: double = 2+, greater = 3+, equal = 4+, lower = 5+, half or less = 6+.',
    details: 'An unmodified 6 is a Critical Wound and always succeeds. An unmodified 1 always fails. Wound-roll modifiers cannot produce a net modifier worse than -1 or better than +1.',
    tags: ['wound chart','strength toughness','2+ 3+ 4+ 5+ 6+','critical wound']
  },
  {
    id: 'allocate-attack', title: 'Allocate Attack', category: 'Making Attacks', page: 22,
    summary: 'The defending player allocates a successful wound to one model in the target unit.',
    details: 'If a model in the unit has already lost wounds or had attacks allocated to it this phase, continue allocating attacks to that model until it is destroyed or the phase ends.',
    tags: ['allocate','wounded model','target model']
  },
  {
    id: 'saving-throw', title: 'Saving Throw and Armour Penetration', category: 'Making Attacks', page: 22,
    summary: 'Modify the model’s Save by the attack’s AP, then roll one D6. The save succeeds if the result equals or exceeds the modified Save.',
    details: 'An unmodified saving throw of 1 always fails. Invulnerable saves are never modified by AP; use either the armour save or invulnerable save, not both.',
    tags: ['save','armour penetration','ap','invulnerable']
  },
  {
    id: 'damage', title: 'Inflict Damage', category: 'Making Attacks', page: 23,
    summary: 'On a failed save, a model loses wounds equal to the weapon’s Damage characteristic.',
    details: 'Normal excess damage is lost when a model is destroyed; it does not spill to another model. Resolve attacks already allocated to a destroyed model only as required by the sequence.',
    tags: ['damage','wounds','excess damage','destroyed']
  },
  {
    id: 'mortal-wounds', title: 'Mortal Wounds', category: 'Making Attacks', page: 23,
    summary: 'Each mortal wound causes one wound to be lost and no saving throw can be made.',
    details: 'Excess mortal wounds continue to be allocated through the target unit. Mortal wounds caused by attacks are applied after normal damage from the attacking unit has been resolved.',
    tags: ['mortal wound','no save','spill over']
  },
  {
    id: 'feel-no-pain', title: 'Feel No Pain X+', category: 'Core Abilities', page: 23,
    summary: 'Each time the model would lose a wound, roll one D6; on X+ that wound is not lost.',
    details: 'This can apply to mortal wounds. If a model has multiple Feel No Pain abilities, use only one for each wound lost.',
    tags: ['fnp','ignore wound','feel no pain']
  },
  {
    id: 'deadly-demise', title: 'Deadly Demise X', category: 'Core Abilities', page: 23,
    summary: 'When the model is destroyed, roll one D6. On a 6, each unit within 6" suffers X mortal wounds.',
    details: 'If X is random, roll separately for each affected unit. For a Transport, roll before embarked units disembark.',
    tags: ['deadly demise','explodes','destroyed','6 inches']
  },
  {
    id: 'lone-operative', title: 'Lone Operative', category: 'Core Abilities', page: 19,
    summary: 'Unless part of an Attached unit, the unit can be selected as a ranged target only if the attacking model is within 12".',
    details: 'This does not prevent melee attacks or other effects that are not ranged attacks.',
    tags: ['lone operative','12 inches','target']
  },
  {
    id: 'stealth', title: 'Stealth', category: 'Core Abilities', page: 20,
    summary: 'Subtract 1 from ranged Hit rolls that target a unit whose models all have Stealth.',
    details: 'Apply the normal cap on Hit-roll modifiers.',
    tags: ['stealth','-1 hit','ranged']
  },
  {
    id: 'assault', title: 'Assault', category: 'Weapon Abilities', page: 25,
    summary: 'A unit that Advanced remains eligible to shoot with its Assault weapons.',
    details: 'When selected to shoot after Advancing, it can resolve attacks only with Assault weapons.',
    tags: ['assault','advance','shoot after advancing']
  },
  {
    id: 'rapid-fire', title: 'Rapid Fire X', category: 'Weapon Abilities', page: 25,
    summary: 'When targeting a unit within half range, increase the weapon’s Attacks by X.',
    details: 'Determine half range using the weapon’s current Range characteristic.',
    tags: ['rapid fire','half range','extra attacks']
  },
  {
    id: 'ignores-cover', title: 'Ignores Cover', category: 'Weapon Abilities', page: 25,
    summary: 'The target cannot receive the Benefit of Cover against attacks made with this weapon.',
    details: 'Other defensive rules still apply normally.',
    tags: ['ignore cover','benefit of cover']
  },
  {
    id: 'twin-linked', title: 'Twin-linked', category: 'Weapon Abilities', page: 25,
    summary: 'Re-roll the Wound roll for attacks made with this weapon.',
    details: 'A die can still never be re-rolled more than once.',
    tags: ['twin linked','reroll wound']
  },
  {
    id: 'pistol', title: 'Pistol', category: 'Weapon Abilities', page: 25,
    summary: 'A unit may shoot Pistols while within Engagement Range, targeting an enemy unit it is engaged with.',
    details: 'Except for Monsters and Vehicles, a model chooses either its Pistols or all its other ranged weapons when selected to shoot; it cannot use both.',
    tags: ['pistol','shoot in combat','engagement range']
  },
  {
    id: 'torrent', title: 'Torrent', category: 'Weapon Abilities', page: 25,
    summary: 'Attacks made with this weapon automatically hit.',
    details: 'Do not make a Hit roll for the attack.',
    tags: ['torrent','automatically hits','flamer']
  },
  {
    id: 'lethal-hits', title: 'Lethal Hits', category: 'Weapon Abilities', page: 25,
    summary: 'A Critical Hit automatically wounds the target.',
    details: 'Do not make a Wound roll for that hit.',
    tags: ['lethal hits','critical hit','auto wound']
  },
  {
    id: 'lance', title: 'Lance', category: 'Weapon Abilities', page: 25,
    summary: 'Add 1 to the Wound roll if the bearer made a Charge move that turn.',
    details: 'The normal cap on Wound-roll modifiers applies.',
    tags: ['lance','charge','+1 wound']
  },
  {
    id: 'indirect-fire', title: 'Indirect Fire', category: 'Weapon Abilities', page: 26,
    summary: 'This weapon may target units not visible to the attacking model.',
    details: 'If no models in the target unit are visible when selected, subtract 1 from the Hit roll and the target has the Benefit of Cover against the attack.',
    tags: ['indirect fire','not visible','cover','-1 hit']
  },
  {
    id: 'precision', title: 'Precision', category: 'Weapon Abilities', page: 26,
    summary: 'After successfully wounding an Attached unit, the attacker may allocate the attack to a visible Character model in that unit.',
    details: 'This replaces the normal allocation restriction for that attack.',
    tags: ['precision','character','attached unit','sniper']
  },
  {
    id: 'blast', title: 'Blast', category: 'Weapon Abilities', page: 26,
    summary: 'When determining attacks, add 1 for every five models in the target unit, rounding down.',
    details: 'Blast weapons cannot attack a unit within Engagement Range of one or more units from the attacking model’s army.',
    tags: ['blast','five models','engagement range','extra attacks']
  },
  {
    id: 'melta', title: 'Melta X', category: 'Weapon Abilities', page: 26,
    summary: 'Increase Damage by X when targeting a unit within half range.',
    details: 'Add the Melta amount after determining any random Damage value.',
    tags: ['melta','half range','damage']
  },
  {
    id: 'heavy', title: 'Heavy', category: 'Weapon Abilities', page: 26,
    summary: 'Add 1 to the Hit roll if the attacking model’s unit Remained Stationary that turn.',
    details: 'The normal cap on Hit-roll modifiers applies.',
    tags: ['heavy','stationary','+1 hit']
  },
  {
    id: 'hazardous', title: 'Hazardous', category: 'Weapon Abilities', page: 28,
    summary: 'After the unit finishes shooting or fighting, roll one D6 for each Hazardous weapon used; each 1 fails the test.',
    details: 'For each failure, destroy one model equipped with a Hazardous weapon. A Character, Monster or Vehicle suffers 3 mortal wounds instead. If a selected Character in an Attached unit used the weapon, allocate those mortal wounds to that Character first.',
    tags: ['hazardous','plasma','roll 1','mortal wounds']
  },
  {
    id: 'sustained-hits', title: 'Sustained Hits X', category: 'Weapon Abilities', page: 28,
    summary: 'Each Critical Hit scores X additional hits on the target.',
    details: 'The additional hits do not themselves count as Critical Hits unless another rule says otherwise.',
    tags: ['sustained hits','critical hit','extra hits']
  },
  {
    id: 'extra-attacks', title: 'Extra Attacks', category: 'Weapon Abilities', page: 28,
    summary: 'The bearer may attack with this weapon in addition to the melee weapon it selects to fight with.',
    details: 'The number of attacks made with an Extra Attacks weapon cannot be modified by other rules.',
    tags: ['extra attacks','melee','additional weapon']
  },
  {
    id: 'devastating-wounds', title: 'Devastating Wounds', category: 'Weapon Abilities', page: 28,
    summary: 'Under the uploaded 24.09 Core Rules, a Critical Wound inflicts mortal wounds equal to the weapon’s Damage and the attack sequence ends.',
    details: 'No normal saving throw is made for that attack. Later rules updates may alter this interaction, so check the current official commentary or balance documents when playing an updated pack.',
    tags: ['devastating wounds','critical wound','mortal wounds','no save']
  },
  {
    id: 'anti', title: 'Anti-keyword X+', category: 'Weapon Abilities', page: 28,
    summary: 'Against a target with the matching keyword, an unmodified Wound roll of X+ is a Critical Wound.',
    details: 'Example: Anti-Vehicle 4+ scores a Critical Wound against Vehicle units on an unmodified 4+.',
    tags: ['anti','critical wound','keyword','anti vehicle']
  },
  {
    id: 'charge-eligibility', title: 'Eligible to Charge', category: 'Charge', page: 29,
    summary: 'A unit is generally eligible to charge if it is within 12" of one or more enemy units and did not Advance or Fall Back that turn.',
    details: 'A unit within Engagement Range cannot normally declare a charge. Aircraft and other rules may add restrictions or exceptions.',
    tags: ['charge eligibility','12 inches','advanced','fell back']
  },
  {
    id: 'declare-charge', title: 'Declare Charge Targets', category: 'Charge', page: 29,
    summary: 'Declare all enemy units the charging unit intends to charge before making the Charge roll.',
    details: 'Each declared target must be within 12" and visible to the charging unit unless another rule says otherwise.',
    tags: ['declare charge','targets','12 inches','visible']
  },
  {
    id: 'charge-roll', title: 'Charge Roll and Charge Move', category: 'Charge', page: 29,
    summary: 'Roll 2D6. The charge succeeds only if the unit can end within Engagement Range of every declared target while remaining coherent.',
    details: 'No model may move within Engagement Range of an enemy unit that was not a declared target. Move charging models up to the roll, ending as close as practical and in legal positions.',
    tags: ['charge roll','2d6','engagement range','coherency']
  },
  {
    id: 'charge-bonus', title: 'Charge Bonus and Fights First', category: 'Charge', page: 29,
    summary: 'A unit that made a Charge move that turn has Fights First until the end of the turn.',
    details: 'Other rules can also grant Fights First.',
    tags: ['charge bonus','fights first']
  },
  {
    id: 'fight-eligibility', title: 'Eligible to Fight', category: 'Fight', page: 32,
    summary: 'A unit is eligible to fight if it is within Engagement Range of an enemy unit or made a Charge move that turn.',
    details: 'Each eligible unit can be selected once in the phase. Resolve Fights First units before Remaining Combats.',
    tags: ['eligible fight','engagement','charged']
  },
  {
    id: 'fight-order', title: 'Fight Phase Order', category: 'Fight', page: 32,
    summary: 'In each step, players alternate selecting eligible units, beginning with the player whose turn is not taking place.',
    details: 'First resolve all Fights First units. Then resolve all remaining eligible units. Counter-offensive can change which unit fights next.',
    tags: ['fight order','alternate','non active player','fights first']
  },
  {
    id: 'pile-in', title: 'Pile In', category: 'Fight', page: 33,
    summary: 'Each model may move up to 3" and must end closer to the closest enemy model, if possible.',
    details: 'If the model can end base-to-base with an enemy model while meeting all conditions, it must do so. The unit must remain coherent.',
    tags: ['pile in','3 inches','closest enemy','base to base']
  },
  {
    id: 'melee-targets', title: 'Select Melee Targets', category: 'Fight', page: 34,
    summary: 'A model may target an enemy unit within Engagement Range of its own unit.',
    details: 'A model that made a Charge move that turn may attack only units it declared as charge targets, unless no models from those units remain within Engagement Range.',
    tags: ['melee targets','charge target','engagement range']
  },
  {
    id: 'consolidate', title: 'Consolidate', category: 'Fight', page: 35,
    summary: 'After fighting, each model may move up to 3" toward the closest enemy model, or toward the closest objective marker when no enemy is in reach under the rule.',
    details: 'A model must end closer to the relevant destination and must move into base-to-base contact when possible. The unit must remain coherent and cannot move within Engagement Range of a new enemy unit unless permitted by the consolidation conditions.',
    tags: ['consolidate','3 inches','objective','closest enemy']
  },
  {
    id: 'deep-strike', title: 'Deep Strike', category: 'Deployment', page: 39,
    summary: 'The unit may start in Reserves and later be set up in a Reinforcements step more than 9" horizontally from all enemy models.',
    details: 'Follow mission restrictions on when Reserves may arrive.',
    tags: ['deep strike','reserves','9 inches','reinforcements']
  },
  {
    id: 'scouts', title: 'Scouts X"', category: 'Deployment', page: 39,
    summary: 'Before the first turn, the unit may make a Normal move up to X", ending more than 9" horizontally from all enemy models.',
    details: 'A Dedicated Transport containing only Scout models may make the move instead. If both players have Scouts, the first-turn player moves Scout units first.',
    tags: ['scouts','pre game move','9 inches','dedicated transport']
  },
  {
    id: 'infiltrators', title: 'Infiltrators', category: 'Deployment', page: 39,
    summary: 'During deployment, the unit may be set up anywhere more than 9" horizontally from the enemy deployment zone and all enemy models.',
    details: 'Every model in the unit must have the ability.',
    tags: ['infiltrators','deployment','9 inches']
  },
  {
    id: 'leader', title: 'Leader and Attached Units', category: 'Deployment', page: 39,
    summary: 'During Declare Battle Formations, a Leader may attach to an eligible Bodyguard unit to form an Attached unit.',
    details: 'The Attached unit is generally treated as one unit. Use the Bodyguard Toughness while Bodyguard models remain. Normal attacks cannot be allocated to Character models while Bodyguards remain, except through rules such as Precision.',
    tags: ['leader','bodyguard','attached unit','character']
  },
  {
    id: 'stratagem-rules', title: 'Using Stratagems', category: 'Core Stratagems', page: 41,
    summary: 'Pay the listed CP cost when using a Stratagem. The same Stratagem cannot be used more than once in the same phase.',
    details: 'A Stratagem cannot be used without enough CP. Individual Stratagems state their timing, targets, effects and restrictions.',
    tags: ['stratagem','command points','same phase','cp cost']
  },
  {
    id: 'command-reroll', title: 'Command Re-roll — 1CP', category: 'Core Stratagems', page: 41,
    summary: 'Use just after an eligible roll, test or save for your army to re-roll it.',
    details: 'Eligible examples include Hit, Wound, Damage, saving throw, Advance, Charge, Desperate Escape, Hazardous, or the roll for a weapon’s number of attacks.',
    tags: ['command reroll','battle tactic','any phase','1cp']
  },
  {
    id: 'counter-offensive', title: 'Counter-offensive — 2CP', category: 'Core Stratagems', page: 41,
    summary: 'Fight phase, just after an enemy unit fights: one engaged unit from your army that has not fought fights next.',
    details: 'The target must be within Engagement Range of one or more enemy units.',
    tags: ['counter offensive','fight next','2cp','strategic ploy']
  },
  {
    id: 'epic-challenge', title: 'Epic Challenge — 1CP', category: 'Core Stratagems', page: 41,
    summary: 'When your Character unit is selected to fight while engaged with an Attached unit, give one Character model Precision on its melee attacks for the phase.',
    details: 'Core Epic Deed Stratagem.',
    tags: ['epic challenge','precision','character','1cp']
  },
  {
    id: 'insane-bravery', title: 'Insane Bravery — 1CP', category: 'Core Stratagems', page: 42,
    summary: 'After one of your units fails a Battle-shock test in your Command phase, treat that test as passed.',
    details: 'The failed unit can be targeted even though it would otherwise be Battle-shocked.',
    tags: ['insane bravery','battle shock','pass','1cp']
  },
  {
    id: 'grenade', title: 'Grenade — 1CP', category: 'Core Stratagems', page: 42,
    summary: 'In your Shooting phase, select an eligible Grenades unit and a visible enemy within 8"; roll six D6 and inflict 1 mortal wound for each 4+.',
    details: 'The Grenades unit must not be within Engagement Range and must not have been selected to shoot. The target cannot be within Engagement Range of your units.',
    tags: ['grenade','6d6','4+','mortal wound','8 inches','1cp']
  },
  {
    id: 'tank-shock', title: 'Tank Shock — 1CP', category: 'Core Stratagems', page: 42,
    summary: 'In your Charge phase, after a Vehicle ends a Charge move, roll D6 equal to a selected melee weapon’s Strength; add two dice if Strength exceeds target Toughness.',
    details: 'Each 5+ inflicts 1 mortal wound, to a maximum of 6 mortal wounds.',
    tags: ['tank shock','vehicle','charge','5+','mortal wounds','1cp']
  },
  {
    id: 'rapid-ingress', title: 'Rapid Ingress — 1CP', category: 'Core Stratagems', page: 42,
    summary: 'At the end of the opponent’s Movement phase, one of your Reserves units may arrive as though it were your Reinforcements step.',
    details: 'The Stratagem cannot allow arrival in a battle round when the unit would not normally be permitted to arrive.',
    tags: ['rapid ingress','reserves','opponent movement','1cp']
  },
  {
    id: 'fire-overwatch', title: 'Fire Overwatch — 1CP', category: 'Core Stratagems', page: 42,
    summary: 'After an enemy is set up or starts or ends a Normal, Advance, Fall Back or Charge move, an eligible unit within 24" may shoot it.',
    details: 'Unmodified Hit rolls of 6 are required, regardless of Ballistic Skill or modifiers. The uploaded Core Rules limit this Stratagem to once per turn.',
    tags: ['overwatch','movement charge','24 inches','hit on 6','1cp']
  },
  {
    id: 'go-to-ground', title: 'Go to Ground — 1CP', category: 'Core Stratagems', page: 42,
    summary: 'After an enemy selects targets in its Shooting phase, one targeted Infantry unit gains a 6+ invulnerable save and Benefit of Cover for the phase.',
    details: 'Core Battle Tactic Stratagem.',
    tags: ['go to ground','infantry','6+ invulnerable','cover','1cp']
  },
  {
    id: 'smokescreen', title: 'Smokescreen — 1CP', category: 'Core Stratagems', page: 42,
    summary: 'After an enemy selects targets in its Shooting phase, one targeted Smoke unit gains Benefit of Cover and Stealth for the phase.',
    details: 'Core Wargear Stratagem.',
    tags: ['smokescreen','smoke','stealth','cover','1cp']
  },
  {
    id: 'heroic-intervention', title: 'Heroic Intervention — 2CP', category: 'Core Stratagems', page: 42,
    summary: 'After an enemy ends a Charge move, one eligible unit within 6" may declare and resolve a charge targeting only that enemy.',
    details: 'A Vehicle can be selected only if it is a Walker. The intervening unit does not receive the Charge bonus that turn.',
    tags: ['heroic intervention','charge','walker','6 inches','2cp']
  },
  {
    id: 'strategic-reserves', title: 'Strategic Reserves', category: 'Reserves', page: 43,
    summary: 'Before battle, up to 25% of the army’s points may be placed into Strategic Reserves; Fortifications cannot be selected.',
    details: 'Strategic Reserves may arrive from battle round 2 onward. Units still off the battlefield when the battle ends count as destroyed.',
    tags: ['strategic reserves','25 percent','round 2','fortification']
  },
  {
    id: 'strategic-reserves-arrival', title: 'Strategic Reserves Arrival Position', category: 'Reserves', page: 43,
    summary: 'Round 2: wholly within 6" of a battlefield edge and not in the enemy deployment zone. Round 3+: wholly within 6" of any battlefield edge.',
    details: 'In all cases, no model may be set up within 9" horizontally of an enemy model.',
    tags: ['reserve arrival','6 inches edge','9 inches enemy','round 2','round 3']
  },
  {
    id: 'benefit-cover', title: 'Benefit of Cover', category: 'Terrain', page: 44,
    summary: 'Add 1 to armour saving throws against ranged attacks; invulnerable saves are not improved.',
    details: 'A model with a 3+ or better Save cannot gain this benefit against an AP 0 attack. Multiple instances do not stack.',
    tags: ['cover','save','ap 0','terrain']
  },
  {
    id: 'craters', title: 'Craters and Rubble', category: 'Terrain', page: 45,
    summary: 'Area Terrain. Infantry models wholly on the feature receive Benefit of Cover.',
    details: 'Models may move over it using the normal terrain movement rules. Normal visibility applies.',
    tags: ['crater','rubble','area terrain','infantry cover']
  },
  {
    id: 'barricades', title: 'Barricades and Fuel Pipes', category: 'Terrain', page: 45,
    summary: 'Infantry wholly within 3" may receive cover when the feature prevents full visibility.',
    details: 'Models cannot end on top. Units on opposite sides can charge and fight across the feature using the special 2" Engagement rules stated for barricades.',
    tags: ['barricade','fuel pipe','2 inches','3 inches','obstacle']
  },
  {
    id: 'debris', title: 'Battlefield Debris and Statuary', category: 'Terrain', page: 46,
    summary: 'A model receives Benefit of Cover if the feature prevents it from being fully visible to every model in the attacking unit.',
    details: 'Models can move over the feature but cannot be set up or end a move on top. Normal visibility applies.',
    tags: ['debris','statuary','obstacle','cover']
  },
  {
    id: 'hills', title: 'Hills and Industrial Structures', category: 'Terrain', page: 46,
    summary: 'Models may be set up or end moves on top when their bases do not overhang.',
    details: 'Normal visibility applies. A model receives Benefit of Cover if the feature prevents full visibility from every attacking model.',
    tags: ['hill','container','sealed building','industrial','cover']
  },
  {
    id: 'woods', title: 'Woods', category: 'Terrain', page: 47,
    summary: 'Area Terrain. Models wholly within Woods are never fully visible; looking through Woods generally prevents full visibility.',
    details: 'Models wholly within can see out normally. Aircraft and Towering models are exceptions to the visibility rule. A model wholly within, or obscured by, the Woods receives Benefit of Cover.',
    tags: ['woods','area terrain','fully visible','cover','towering','aircraft']
  },
  {
    id: 'ruins', title: 'Ruins', category: 'Terrain', page: 48,
    summary: 'Models outside cannot see over or through a Ruin to a target on the far side; models can see into it and models wholly within can see out.',
    details: 'Infantry and Beasts can move through walls and floors as though absent; Infantry, Beasts and Fly can use upper floors if bases fit. Models wholly within or obscured by the Ruin receive Benefit of Cover. Plunging Fire improves AP by 1 when the attacker is wholly within, at least 6" above ground, and every target model is at ground level.',
    tags: ['ruins','walls','visibility','plunging fire','cover','area terrain']
  },
  {
    id: 'aircraft-deploy', title: 'Aircraft Deployment and Hover', category: 'Aircraft', page: 53,
    summary: 'Aircraft normally begin in Reserves and are treated as Strategic Reserves after the battle starts.',
    details: 'A model with Hover may be declared in Hover mode during Declare Battle Formations; it then has Move 20", loses Aircraft and follows normal model rules for the battle.',
    tags: ['aircraft','hover','reserves','20 inches']
  },
  {
    id: 'aircraft-move', title: 'Aircraft Movement', category: 'Aircraft', page: 53,
    summary: 'Aircraft make only Normal moves: at least 20" straight forward, then pivot up to 90°.',
    details: 'They may move even while engaged. If an Aircraft crosses the battlefield edge or cannot complete the minimum move, place it into Strategic Reserves; it returns in its controlling player’s next turn.',
    tags: ['aircraft movement','minimum 20','pivot 90','battlefield edge']
  },
  {
    id: 'aircraft-combat', title: 'Aircraft in Charge and Fight Phases', category: 'Aircraft', page: 54,
    summary: 'Aircraft cannot charge. Only units that can Fly may charge or make melee attacks against Aircraft.',
    details: 'Aircraft can fight only units that can Fly and cannot Pile In or Consolidate.',
    tags: ['aircraft fight','fly','cannot charge','pile in']
  },
  {
    id: 'objective-control', title: 'Objective Control', category: 'Missions', page: 58,
    summary: 'A model is in range of an objective within 3" horizontally and 5" vertically. Add the OC of all models each player has in range.',
    details: 'At the end of a phase, the player with the higher Level of Control controls the objective; a tie is contested. Models cannot end a move on top of an objective marker.',
    tags: ['objective','oc','3 inches','5 inches','contested','control']
  },
  {
    id: 'mission-sequence', title: 'Mission Sequence', category: 'Missions', page: 57,
    summary: 'Muster armies, read objectives, create battlefield, determine Attacker/Defender, declare formations, deploy, determine first turn, resolve pre-battle rules, begin, end, determine victor.',
    details: 'Mission-specific instructions override or add to the general sequence.',
    tags: ['mission setup','pregame','attacker defender','deploy','first turn']
  },
  {
    id: 'only-war', title: 'Only War — Capture and Control', category: 'Missions', page: 59,
    summary: 'Starting in battle round 2, at the end of each player’s Command phase, score 1VP per controlled objective, to a maximum of 3VP per turn.',
    details: 'Use four objective markers. The battle ends when one army is destroyed or after battle round 5. Otherwise, the player with the most VP wins; a tie is a draw.',
    tags: ['only war','capture and control','score command phase','round 2','four objectives']
  }
];

window.RULE_CATEGORIES = ['All', ...Array.from(new Set(window.RULES_DATA.map(rule => rule.category)))];
