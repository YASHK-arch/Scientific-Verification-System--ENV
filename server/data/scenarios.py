"""
ClaimLens — Scientific Scenarios
10 curated scenarios across 3 difficulty levels for claim verification.
"""

SCENARIOS = {
    # ════════════════════════════ EASY ════════════════════════════
    "easy_1": {
        "task_id": "easy_1",
        "difficulty": "easy",
        "claim": "Vitamin C supplementation cures viral infections such as the common cold.",
        "expected_verdict": "unsupported",
        "expected_confidence_range": [0.75, 1.0],
        "evidence": [
            {
                "id": "ev_e1_1",
                "type": "paper_summary",
                "title": "Cochrane Review: Vitamin C for Preventing and Treating the Common Cold (2013)",
                "full_content": (
                    "STUDY DESIGN: Systematic review and meta-analysis of 29 randomized "
                    "controlled trials involving 11,306 participants.\n\n"
                    "RESULTS: Regular supplementation with Vitamin C (≥200 mg/day) did NOT "
                    "reduce the incidence of colds in the general population (RR = 0.97, "
                    "95% CI: 0.94–1.00). A modest reduction in cold duration was observed "
                    "(8% in adults, 14% in children), but this is not clinically synonymous "
                    "with 'curing' the infection.\n\n"
                    "CONCLUSION: Vitamin C supplementation does not prevent or cure the common "
                    "cold. Routine supplementation is not justified for the general population. "
                    "High-dose therapeutic use after symptom onset showed no significant benefit."
                ),
            }
        ],
    },
    "easy_2": {
        "task_id": "easy_2",
        "difficulty": "easy",
        "claim": "Low-dose aspirin therapy reduces the risk of cardiovascular events in high-risk patients.",
        "expected_verdict": "supported",
        "expected_confidence_range": [0.8, 1.0],
        "evidence": [
            {
                "id": "ev_e2_1",
                "type": "paper_summary",
                "title": "Antithrombotic Trialists' Collaboration Meta-Analysis (Lancet, 2009)",
                "full_content": (
                    "STUDY DESIGN: Individual patient data meta-analysis of 6 primary "
                    "prevention trials (95,000 individuals) and 16 secondary prevention "
                    "trials (17,000 individuals).\n\n"
                    "RESULTS — Secondary Prevention: Aspirin produced a significant 20% "
                    "proportional reduction in serious vascular events (p < 0.0001). "
                    "Non-fatal myocardial infarction was reduced by one-third. "
                    "Stroke was reduced by approximately 25%.\n\n"
                    "RESULTS — Primary Prevention: Aspirin reduced serious vascular events "
                    "by 12% (RR = 0.88, 95% CI: 0.82–0.94, p = 0.0001), mainly due to a "
                    "reduction in non-fatal MI.\n\n"
                    "RISKS: Major gastrointestinal and extracranial bleeds were increased "
                    "by aspirin (RR = 1.54). The net benefit depends on baseline "
                    "cardiovascular risk.\n\n"
                    "CONCLUSION: In high-risk patients (secondary prevention), the benefits "
                    "of aspirin clearly outweigh the risks. The evidence strongly supports "
                    "low-dose aspirin for cardiovascular risk reduction in this population."
                ),
            }
        ],
    },
    "easy_3": {
        "task_id": "easy_3",
        "difficulty": "easy",
        "claim": "Homeopathic remedies are more clinically effective than placebo treatments.",
        "expected_verdict": "unsupported",
        "expected_confidence_range": [0.8, 1.0],
        "evidence": [
            {
                "id": "ev_e3_1",
                "type": "paper_summary",
                "title": "NHMRC Review: Evidence on the Effectiveness of Homeopathy (2015)",
                "full_content": (
                    "STUDY DESIGN: Comprehensive systematic review commissioned by the "
                    "Australian National Health and Medical Research Council. Assessed 57 "
                    "systematic reviews covering 176 individual studies across 68 clinical "
                    "conditions.\n\n"
                    "RESULTS: No good-quality, well-designed studies with enough participants "
                    "showed that homeopathy was more effective than placebo. Studies that "
                    "reported positive results were either poorly designed, had too few "
                    "participants, or were below the quality threshold.\n\n"
                    "CONCLUSION: There is no reliable evidence from research in humans that "
                    "homeopathy is effective for treating any health condition. People who "
                    "choose homeopathy may put their health at risk if they reject or delay "
                    "treatments for which there is good evidence of safety and effectiveness."
                ),
            }
        ],
    },
    "easy_4": {
        "task_id": "easy_4",
        "difficulty": "easy",
        "claim": "Regular physical exercise significantly reduces the risk of developing type 2 diabetes.",
        "expected_verdict": "supported",
        "expected_confidence_range": [0.8, 1.0],
        "evidence": [
            {
                "id": "ev_e4_1",
                "type": "trial_outcome",
                "title": "Diabetes Prevention Program (DPP) — Landmark RCT (NEJM, 2002)",
                "full_content": (
                    "STUDY DESIGN: Multi-center randomized controlled trial. 3,234 "
                    "participants with elevated fasting glucose and impaired glucose tolerance "
                    "were randomized to: (1) lifestyle intervention (150 min/week moderate "
                    "exercise + dietary changes), (2) metformin 850mg twice daily, or "
                    "(3) placebo.\n\n"
                    "FOLLOW-UP: Average 2.8 years.\n\n"
                    "RESULTS: The lifestyle intervention group (including regular exercise) "
                    "had a 58% reduction in the incidence of type 2 diabetes compared to "
                    "placebo (p < 0.001). Metformin reduced incidence by 31%. The lifestyle "
                    "intervention was significantly more effective than metformin "
                    "(p < 0.001).\n\n"
                    "SUBGROUP ANALYSIS: The benefit was consistent across all age groups, "
                    "sexes, and ethnic groups.\n\n"
                    "CONCLUSION: A structured exercise and lifestyle program is highly "
                    "effective at preventing type 2 diabetes in high-risk individuals, "
                    "outperforming pharmacological intervention."
                ),
            }
        ],
    },

    # ════════════════════════════ MEDIUM ════════════════════════════
    "medium_1": {
        "task_id": "medium_1",
        "difficulty": "medium",
        "claim": "Adherence to a Mediterranean diet significantly reduces the risk of Alzheimer's disease.",
        "expected_verdict": "supported",
        "expected_confidence_range": [0.7, 0.95],
        "evidence": [
            {
                "id": "ev_m1_1",
                "type": "paper_summary",
                "title": "Meta-Analysis: Mediterranean Diet and Neurodegenerative Diseases (Nutrients, 2020)",
                "full_content": (
                    "STUDY DESIGN: Systematic review and meta-analysis of 12 prospective "
                    "cohort studies (total n = 40,112 participants) examining the association "
                    "between Mediterranean diet adherence and risk of Alzheimer's disease.\n\n"
                    "RESULTS: High adherence to the Mediterranean diet was associated with a "
                    "40% reduced risk of Alzheimer's disease (HR = 0.60, 95% CI: 0.48–0.77, "
                    "p < 0.001). Moderate adherence was associated with a 15% reduction "
                    "(HR = 0.85, 95% CI: 0.72–0.95). The dose-response relationship was "
                    "statistically significant.\n\n"
                    "MECHANISMS: The authors attribute the effect to anti-inflammatory and "
                    "antioxidant properties of the diet, including polyphenols, omega-3 fatty "
                    "acids, and reduced processed food intake.\n\n"
                    "QUALITY ASSESSMENT: 9 of 12 studies scored 'Good' on Newcastle-Ottawa "
                    "Scale. Heterogeneity was low (I² = 22%).\n\n"
                    "CONCLUSION: Strong epidemiological evidence supports a significant "
                    "protective effect of the Mediterranean diet against Alzheimer's disease."
                ),
            },
            {
                "id": "ev_m1_2",
                "type": "paper_summary",
                "title": "Observational Study: Diet and Dementia in Rural Greece (2008) — RETRACTED",
                "full_content": (
                    "STUDY DESIGN: Small observational study (n = 38) in a single rural Greek "
                    "village. Self-reported dietary data collected via interviews with family "
                    "members. No control group.\n\n"
                    "RESULTS: The study claimed that villagers who ate a 'traditional diet' "
                    "had HIGHER rates of cognitive decline, contradicting the Mediterranean "
                    "diet hypothesis.\n\n"
                    "⚠️ RETRACTION NOTICE (2010): This paper was retracted due to: "
                    "(1) undisclosed conflicts of interest — lead author received funding "
                    "from a processed food industry consortium, (2) data fabrication — "
                    "independent review found inconsistencies in reported participant ages "
                    "and dietary intake, (3) failure to obtain ethics committee approval.\n\n"
                    "CONCLUSION: This study's findings are unreliable and should not be "
                    "used as evidence in systematic analyses."
                ),
            },
        ],
    },
    "medium_2": {
        "task_id": "medium_2",
        "difficulty": "medium",
        "claim": "5G radio-frequency electromagnetic fields cause cancer in humans.",
        "expected_verdict": "unsupported",
        "expected_confidence_range": [0.75, 1.0],
        "evidence": [
            {
                "id": "ev_m2_1",
                "type": "paper_summary",
                "title": "WHO/ICNIRP Review: Radio-Frequency EMF and Health (2022)",
                "full_content": (
                    "STUDY DESIGN: Comprehensive systematic review by the International "
                    "Commission on Non-Ionizing Radiation Protection (ICNIRP), endorsed by "
                    "WHO. Reviewed over 350 studies on RF-EMF health effects published "
                    "between 2000 and 2022.\n\n"
                    "RESULTS: No consistent or convincing evidence that RF-EMF exposure "
                    "below ICNIRP guidelines causes adverse health effects, including "
                    "cancer. Specifically for 5G frequencies (sub-6 GHz and mmWave): "
                    "the energy levels are non-ionizing and insufficient to damage DNA.\n\n"
                    "MECHANISM REVIEW: RF-EMF at 5G power levels does not have enough "
                    "energy to break chemical bonds or cause the DNA mutations required "
                    "for carcinogenesis.\n\n"
                    "CONCLUSION: Current evidence does not support a causal link between "
                    "5G (or any sub-guideline RF-EMF) exposure and cancer in humans."
                ),
            },
            {
                "id": "ev_m2_2",
                "type": "paper_summary",
                "title": "Study: 5G Millimeter Waves and Cellular Damage (Journal of Bioelectrics, 2021)",
                "full_content": (
                    "STUDY DESIGN: In vitro experiment exposing skin cell cultures to "
                    "26 GHz mmWave radiation at 10x above normal 5G transmission power "
                    "for 72 continuous hours.\n\n"
                    "RESULTS: Observed a 12% increase in oxidative stress markers compared "
                    "to control cells. The authors concluded that '5G radiation may pose "
                    "an underappreciated risk to human health.'\n\n"
                    "⚠️ CRITICAL LIMITATIONS:\n"
                    "• Published in 'Journal of Bioelectrics' — a predatory journal not "
                    "indexed in PubMed or Scopus, with no peer review process.\n"
                    "• Exposure levels (10x above normal) are physically impossible from "
                    "consumer 5G devices.\n"
                    "• In vitro results in isolated cell cultures cannot be extrapolated "
                    "to whole-organism cancer risk.\n"
                    "• Sample size: only 3 cell culture plates per condition.\n"
                    "• No dose-response relationship was established.\n\n"
                    "CONCLUSION: This study's design and publication venue severely limit "
                    "its reliability. The conclusions are not supported by the methodology."
                ),
            },
        ],
    },
    "medium_3": {
        "task_id": "medium_3",
        "difficulty": "medium",
        "claim": "Intermittent fasting extends average lifespan in humans.",
        "expected_verdict": "inconclusive",
        "expected_confidence_range": [0.3, 0.6],
        "evidence": [
            {
                "id": "ev_m3_1",
                "type": "trial_outcome",
                "title": "Animal Study: Caloric Restriction and Longevity in Mice (Nature Aging, 2022)",
                "full_content": (
                    "STUDY DESIGN: Randomized controlled study in C57BL/6J mice (n = 960). "
                    "Groups: ad libitum feeding, 20% caloric restriction (CR), and "
                    "intermittent fasting (IF, alternate-day feeding) from 6 months of age.\n\n"
                    "RESULTS: IF mice lived 11% longer than ad libitum controls (median "
                    "lifespan: 35.5 vs 32.0 months, p < 0.001). CR mice lived 18% longer "
                    "(median: 37.8 months). Both groups showed improved metabolic markers.\n\n"
                    "NOTE: These are animal model results. Mouse-to-human translation of "
                    "longevity interventions has historically been poor. Mice have different "
                    "metabolic rates, lifespans, and caloric needs."
                ),
            },
            {
                "id": "ev_m3_2",
                "type": "paper_summary",
                "title": "Human RCT: CALERIE Phase 2 — Caloric Restriction in Non-Obese Adults (Lancet, 2023)",
                "full_content": (
                    "STUDY DESIGN: 2-year randomized controlled trial of moderate caloric "
                    "restriction (25% reduction) in 218 healthy, non-obese adults aged "
                    "21-50. This is the longest controlled CR trial in humans.\n\n"
                    "RESULTS: CR improved several cardiometabolic risk factors: reduced "
                    "LDL cholesterol (-12%), blood pressure (-4 mmHg), and inflammatory "
                    "markers (CRP -47%). However, NO mortality data was collected — the "
                    "study was not powered or designed to assess lifespan.\n\n"
                    "CRITICAL GAP: No human RCT has ever demonstrated that intermittent "
                    "fasting or caloric restriction extends actual lifespan. The longest "
                    "human CR study (2 years) showed metabolic improvements but did not "
                    "and could not measure mortality outcomes.\n\n"
                    "CONCLUSION: While IF/CR improve metabolic health markers in humans, "
                    "the claim that they extend human lifespan remains unproven. "
                    "Extrapolating from mouse studies to human longevity is scientifically "
                    "unsupported at this time."
                ),
            },
        ],
    },

    # ════════════════════════════ HARD ════════════════════════════
    "hard_1": {
        "task_id": "hard_1",
        "difficulty": "hard",
        "claim": "Drug X (Tumorcidab) significantly reduces tumor growth in advanced colorectal cancer patients.",
        "expected_verdict": "unsupported",
        "expected_confidence_range": [0.6, 0.9],
        "evidence": [
            {
                "id": "ev_h1_1",
                "type": "trial_outcome",
                "title": "Phase II Trial: Tumorcidab in Advanced CRC — Narrative Summary",
                "full_content": (
                    "TRIAL SUMMARY (Press Release, BioPharmX Corp):\n"
                    "'We are thrilled to announce promising results from our Phase II trial "
                    "of Tumorcidab in advanced colorectal cancer patients. The treatment arm "
                    "showed a meaningful reduction in tumor volume compared to placebo. "
                    "Patients receiving Tumorcidab experienced an average 18% reduction in "
                    "tumor size, compared to only 7% in the control group. These results "
                    "demonstrate the potential of Tumorcidab as a breakthrough therapy.'\n\n"
                    "— Dr. Sarah Mitchell, Chief Medical Officer, BioPharmX Corp."
                ),
            },
            {
                "id": "ev_h1_2",
                "type": "dataset_snippet",
                "title": "Phase II Trial: Tumorcidab — Raw Statistical Data",
                "full_content": (
                    "TRIAL ID: BPX-CRC-2024-PII\n"
                    "DESIGN: Double-blind, placebo-controlled\n"
                    "ENROLLED: n = 84 (treatment: 42, placebo: 42)\n\n"
                    "PRIMARY ENDPOINT: Change in tumor volume at 12 weeks\n"
                    "┌──────────────┬───────────┬─────────┬────────────────┐\n"
                    "│ Group        │ Mean Δ    │ Std Dev │ 95% CI         │\n"
                    "├──────────────┼───────────┼─────────┼────────────────┤\n"
                    "│ Tumorcidab   │ -18.2%    │ 31.4%   │ [-27.9, -8.5]  │\n"
                    "│ Placebo      │ -7.1%     │ 28.7%   │ [-15.9, +1.7]  │\n"
                    "└──────────────┴───────────┴─────────┴────────────────┘\n\n"
                    "STATISTICAL TEST: Two-sample t-test (two-tailed)\n"
                    "t-statistic: 1.63\n"
                    "p-value: 0.107\n"
                    "Effect size (Cohen's d): 0.37 (small-to-medium)\n\n"
                    "⚠️ p = 0.107 > α = 0.05 — Result is NOT statistically significant.\n\n"
                    "SECONDARY ENDPOINTS:\n"
                    "• Progression-free survival: HR = 0.81, p = 0.23 (not significant)\n"
                    "• Overall survival: HR = 0.91, p = 0.54 (not significant)\n"
                    "• Quality of life: No significant difference between groups\n\n"
                    "ADVERSE EVENTS: Treatment arm had higher rates of nausea (38% vs 12%) "
                    "and fatigue (29% vs 14%)."
                ),
            },
        ],
    },
    "hard_2": {
        "task_id": "hard_2",
        "difficulty": "hard",
        "claim": "Vaccine Y (ViralShield-mRNA) prevents 95% of SARS-CoV-3 infections.",
        "expected_verdict": "inconclusive",
        "expected_confidence_range": [0.2, 0.5],
        "evidence": [
            {
                "id": "ev_h2_1",
                "type": "trial_outcome",
                "title": "Press Briefing: ViralShield-mRNA Phase I/II Interim Results",
                "full_content": (
                    "PRESS BRIEFING (ImmunoGen Labs, March 2025):\n"
                    "'Our ground-breaking ViralShield-mRNA vaccine has shown extraordinary "
                    "efficacy in our Phase I/II trial. Among vaccinated participants, we "
                    "observed a 95.2% reduction in confirmed SARS-CoV-3 infections compared "
                    "to the placebo group. The vaccine was well-tolerated with only mild "
                    "injection site reactions reported. We believe ViralShield will be the "
                    "gold standard in pandemic preparedness.'\n\n"
                    "— Prof. James Chen, CSO, ImmunoGen Labs"
                ),
            },
            {
                "id": "ev_h2_2",
                "type": "dataset_snippet",
                "title": "ViralShield-mRNA Trial — Actual Enrollment & Efficacy Data",
                "full_content": (
                    "TRIAL ID: IGL-SC3-2025-PI/II\n"
                    "PHASE: Combined Phase I/II (safety + preliminary efficacy)\n"
                    "ENROLLED: n = 20 (treatment: 10, placebo: 10)\n\n"
                    "INFECTION OUTCOMES (28-day follow-up):\n"
                    "┌──────────────┬──────────┬──────────┬──────────────┐\n"
                    "│ Group        │ Total    │ Infected │ Infection %  │\n"
                    "├──────────────┼──────────┼──────────┼──────────────┤\n"
                    "│ Vaccine      │ 10       │ 0        │ 0%           │\n"
                    "│ Placebo      │ 10       │ 2        │ 20%          │\n"
                    "└──────────────┴──────────┴──────────┴──────────────┘\n\n"
                    "CALCULATED EFFICACY: VE = (1 - 0/2) × 100 = 100%*\n"
                    "* But: only 2 events in placebo arm. 95% CI for VE: [-29.4%, 100%]\n\n"
                    "⚠️ CRITICAL ISSUES:\n"
                    "• n = 20 is far too small for reliable efficacy estimation\n"
                    "• Only 2 total infection events occurred — cannot calculate meaningful VE\n"
                    "• Phase I/II trials are designed for SAFETY, not efficacy\n"
                    "• The 95% confidence interval spans from -29.4% to 100%\n"
                    "• No Phase III trial has been conducted\n"
                    "• 28-day follow-up is insufficient for durability assessment\n\n"
                    "STATISTICAL NOTE: With only 2 events, Fisher's exact test yields "
                    "p = 0.474 — NOT statistically significant."
                ),
            },
            {
                "id": "ev_h2_3",
                "type": "paper_summary",
                "title": "Review: Statistical Pitfalls in Vaccine Efficacy Estimation (BMJ, 2021)",
                "full_content": (
                    "KEY POINTS FROM REVIEW:\n"
                    "• Vaccine efficacy (VE) estimates from small trials are extremely "
                    "unreliable and often misleading.\n"
                    "• A minimum of ~150-200 infection events across both arms is typically "
                    "required for a meaningful VE estimate.\n"
                    "• Phase I/II trials with n < 100 should NEVER be used to claim specific "
                    "efficacy percentages — they are powered for safety, not efficacy.\n"
                    "• The FDA requires Phase III data (typically n > 15,000) before approving "
                    "efficacy claims for vaccines.\n"
                    "• Historic example: Several HIV vaccine candidates showed >90% efficacy "
                    "in tiny Phase I trials but failed completely in Phase III."
                ),
            },
        ],
    },
    "hard_3": {
        "task_id": "hard_3",
        "difficulty": "hard",
        "claim": "Gene therapy Z (TeloRestore) reverses key biomarkers of aging in humans.",
        "expected_verdict": "inconclusive",
        "expected_confidence_range": [0.2, 0.5],
        "evidence": [
            {
                "id": "ev_h3_1",
                "type": "paper_summary",
                "title": "Pre-print: TeloRestore Gene Therapy Shows Remarkable Anti-Aging Effects (bioRxiv, 2025)",
                "full_content": (
                    "STUDY DESIGN: Open-label, single-arm pilot study. 12 volunteers "
                    "(ages 55-70) received a single IV infusion of TeloRestore, an AAV-based "
                    "gene therapy targeting telomerase reverse transcriptase (TERT).\n\n"
                    "RESULTS (6-month follow-up):\n"
                    "• Telomere length: increased by 18% on average (p < 0.01)\n"
                    "• Epigenetic age (Horvath clock): decreased by 3.2 years (p < 0.05)\n"
                    "• Grip strength: improved by 11% (p < 0.05)\n"
                    "• Cognitive scores (MoCA): improved by 2.1 points (p < 0.05)\n\n"
                    "AUTHORS' CONCLUSION: 'TeloRestore represents a paradigm shift in "
                    "anti-aging medicine, demonstrating for the first time that gene therapy "
                    "can reverse the hallmarks of human aging.'\n\n"
                    "⚠️ NOTE: This is a PRE-PRINT (not peer-reviewed). Posted on bioRxiv."
                ),
            },
            {
                "id": "ev_h3_2",
                "type": "dataset_snippet",
                "title": "TeloRestore Trial — Individual Patient Data & Confounders",
                "full_content": (
                    "TRIAL ID: TR-AGING-2025-PILOT\n"
                    "DESIGN: Open-label, NO placebo control, NO blinding\n\n"
                    "INDIVIDUAL PATIENT DATA:\n"
                    "┌─────┬─────┬────────────┬────────────┬──────────────────┐\n"
                    "│ ID  │ Age │ ΔTelomere  │ ΔEpiAge    │ Confounders      │\n"
                    "├─────┼─────┼────────────┼────────────┼──────────────────┤\n"
                    "│ P01 │ 58  │ +22%       │ -4.1 yrs   │ Started exercise │\n"
                    "│ P02 │ 63  │ +15%       │ -2.8 yrs   │ New diet program │\n"
                    "│ P03 │ 55  │ +31%       │ -5.2 yrs   │ Quit smoking     │\n"
                    "│ P04 │ 67  │ +8%        │ -1.1 yrs   │ None reported    │\n"
                    "│ P05 │ 70  │ +12%       │ -2.5 yrs   │ None reported    │\n"
                    "│ P06 │ 59  │ +19%       │ -3.5 yrs   │ Started yoga     │\n"
                    "│ P07 │ 62  │ +25%       │ -4.0 yrs   │ Weight loss -8kg │\n"
                    "│ P08 │ 66  │ +14%       │ -2.2 yrs   │ New supplements  │\n"
                    "│ P09 │ 57  │ +20%       │ -3.8 yrs   │ Started exercise │\n"
                    "│ P10 │ 64  │ +11%       │ -2.0 yrs   │ None reported    │\n"
                    "│ P11 │ 69  │ +16%       │ -3.1 yrs   │ Quit alcohol     │\n"
                    "│ P12 │ 56  │ +28%       │ -4.8 yrs   │ New diet + gym   │\n"
                    "└─────┴─────┴────────────┴────────────┴──────────────────┘\n\n"
                    "⚠️ CRITICAL CONFOUNDERS:\n"
                    "• 8 of 12 patients (67%) made significant lifestyle changes during "
                    "the trial period that are INDEPENDENTLY known to affect the measured "
                    "biomarkers.\n"
                    "• Exercise alone can increase telomere length by 3-10% and reduce "
                    "epigenetic age by 1-3 years.\n"
                    "• Without a placebo control, it is IMPOSSIBLE to attribute the observed "
                    "changes specifically to TeloRestore.\n"
                    "• The 3 patients with largest effects (P03, P07, P12) all had major "
                    "lifestyle changes.\n"
                    "• The 3 patients with smallest effects (P04, P05, P10) reported no "
                    "lifestyle changes — their improvements could represent measurement "
                    "variability or regression to the mean."
                ),
            },
        ],
    },
}


def get_scenario(task_id: str) -> dict:
    """Retrieve a scenario by task_id. Raises KeyError if not found."""
    if task_id not in SCENARIOS:
        raise KeyError(
            f"Unknown task_id '{task_id}'. Available: {list(SCENARIOS.keys())}"
        )
    return SCENARIOS[task_id]


def list_scenarios() -> list:
    """Return lightweight metadata for all scenarios."""
    return [
        {
            "task_id": s["task_id"],
            "difficulty": s["difficulty"],
            "claim": s["claim"],
            "evidence_count": len(s["evidence"]),
        }
        for s in SCENARIOS.values()
    ]
