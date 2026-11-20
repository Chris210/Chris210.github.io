/* QS university partner ranking source of truth for V2. Refresh via annual 1 April agent; preserve actual published edition years. */
(function(){
'use strict';
const data={
  "schema_version": 1,
  "created": "2026-11-20",
  "updated": "2026-11-20",
  "description": "Separate QS ranking editions per metric. Unknown/null means not researched or no confirmed published value, never an assertion that a university is unranked.",
  "rankings": {
    "overall": {
      "latest_published_edition": 2027,
      "published_on": "2026-06-18",
      "source_url": "https://www.topuniversities.com/world-university-rankings"
    },
    "art_design": {
      "latest_published_edition": 2026,
      "published_on": "2026-03-25",
      "source_url": "https://www.topuniversities.com/university-subject-rankings/art-design"
    }
  },
  "home_university": {
    "name": "Loughborough University",
    "art_design": {
      "edition": 2026,
      "rank": "=48",
      "score": null,
      "source_url": "https://www.lboro.ac.uk/media-centre/press-releases/2026/march/decade-best-in-world-for-sports-related-subjects/",
      "verification": "university_press_release"
    }
  },
  "partners": [
    {
      "id": 6,
      "name": "Academy of Fine Arts, Helsinki",
      "aliases": [
        "Academy of Fine Art, Finland"
      ],
      "source_group": "Exchange Programme",
      "overall": null,
      "art_design": null
    },
    {
      "id": 7,
      "name": "Academy of Fine Arts & NTNU, Norway",
      "aliases": [],
      "source_group": "Exchange Programme",
      "overall": null,
      "art_design": null
    },
    {
      "id": 65,
      "name": "City University of Hong Kong",
      "aliases": [
        "City University , Hong Kong"
      ],
      "source_group": "Exchange Programme",
      "overall": {
        "edition": 2027,
        "rank": "=52",
        "score": null,
        "source_url": "https://www.topuniversities.com/universities/city-university-hong-kong",
        "verification": "previously_displayed"
      },
      "art_design": null
    },
    {
      "id": 74,
      "name": "Curtin University",
      "aliases": [
        "Curtin University, Australia"
      ],
      "source_group": "Exchange Programme",
      "overall": {
        "edition": 2027,
        "rank": "189",
        "score": null,
        "source_url": "https://www.topuniversities.com/universities/curtin-university",
        "verification": "previously_displayed"
      },
      "art_design": null
    },
    {
      "id": 80,
      "name": "Delft University of Technology (TU Delft)",
      "aliases": [
        "Delft University of Technology (TU Delft), Netherlands"
      ],
      "source_group": "Exchange Programme",
      "overall": {
        "edition": 2027,
        "rank": "48",
        "score": null,
        "source_url": "https://www.topuniversities.com/universities/delft-university-technology",
        "verification": "previously_displayed"
      },
      "art_design": {
        "edition": 2026,
        "rank": "13",
        "score": 77.9,
        "source_url": "https://www.topuniversities.com/university-subject-rankings/art-design",
        "verification": "qs_subject_2026"
      }
    },
    {
      "id": 85,
      "name": "Design School Kolding",
      "aliases": [
        "Design School Kolding, Denmark"
      ],
      "source_group": "Exchange Programme",
      "overall": null,
      "art_design": null
    },
    {
      "id": 173,
      "name": "Joshibi University of Art and Design",
      "aliases": [
        "Joshibi University of Art & Design, Japan"
      ],
      "source_group": "Exchange Programme",
      "overall": null,
      "art_design": null
    },
    {
      "id": 175,
      "name": "Kansai University",
      "aliases": [
        "Kansai University, Japan"
      ],
      "source_group": "Exchange Programme",
      "overall": null,
      "art_design": null
    },
    {
      "id": 176,
      "name": "Kansas City Art Institute",
      "aliases": [
        "Kansas City Art Institute, USA"
      ],
      "source_group": "Exchange Programme",
      "overall": null,
      "art_design": null
    },
    {
      "id": 204,
      "name": "Middle East Technical University (METU)",
      "aliases": [],
      "source_group": "Exchange Programme",
      "overall": {
        "edition": 2027,
        "rank": "305",
        "score": null,
        "source_url": "https://www.topuniversities.com/universities/middle-east-technical-university",
        "verification": "previously_displayed"
      },
      "art_design": null
    },
    {
      "id": 206,
      "name": "Mimar Sinan Fine Arts University",
      "aliases": [
        "Mimar Sinan Fine Arts, Turkey"
      ],
      "source_group": "Exchange Programme",
      "overall": null,
      "art_design": null
    },
    {
      "id": 214,
      "name": "Nanyang Technological University",
      "aliases": [
        "Nanyang Technological University, Singapore"
      ],
      "source_group": "Exchange Programme",
      "overall": {
        "edition": 2027,
        "rank": "12",
        "score": null,
        "source_url": "https://www.topuniversities.com/universities/nanyang-technological-university-singapore-ntu",
        "verification": "previously_displayed"
      },
      "art_design": null
    },
    {
      "id": 218,
      "name": "New Mexico State University, USA",
      "aliases": [],
      "source_group": "Exchange Programme",
      "overall": null,
      "art_design": null
    },
    {
      "id": 223,
      "name": "Norwegian University of Science and Technology (NTNU)",
      "aliases": [
        "NTNU, Norway"
      ],
      "source_group": "Exchange Programme",
      "overall": {
        "edition": 2027,
        "rank": "264",
        "score": null,
        "source_url": "https://www.topuniversities.com/universities/norwegian-university-science-technology",
        "verification": "previously_displayed"
      },
      "art_design": null
    },
    {
      "id": 250,
      "name": "Politecnico di Milano",
      "aliases": [
        "Politecnico di Milano, Italy"
      ],
      "source_group": "Exchange Programme",
      "overall": {
        "edition": 2027,
        "rank": "=87",
        "score": null,
        "source_url": "https://www.topuniversities.com/universities/politecnico-di-milano",
        "verification": "previously_displayed"
      },
      "art_design": {
        "edition": 2026,
        "rank": "7",
        "score": 83.3,
        "source_url": "https://www.topuniversities.com/university-subject-rankings/art-design",
        "verification": "qs_subject_2026"
      }
    },
    {
      "id": 260,
      "name": "RheinMain University of Applied Sciences",
      "aliases": [
        "RheinMain University of Applied Sciences, Germany"
      ],
      "source_group": "Exchange Programme",
      "overall": null,
      "art_design": null
    },
    {
      "id": 282,
      "name": "Shibaura Institute of Technology",
      "aliases": [
        "Shibaura Institute of Technology, Japan"
      ],
      "source_group": "Exchange Programme",
      "overall": null,
      "art_design": null
    },
    {
      "id": 323,
      "name": "University of Europe for Applied Sciences (Berlin), Germany",
      "aliases": [],
      "source_group": "Exchange Programme",
      "overall": null,
      "art_design": null
    },
    {
      "id": 324,
      "name": "University of Michigan",
      "aliases": [
        "University of Michigan, USA"
      ],
      "source_group": "Exchange Programme",
      "overall": {
        "edition": 2027,
        "rank": "51",
        "score": null,
        "source_url": "https://www.topuniversities.com/universities/university-michigan-ann-arbor",
        "verification": "previously_displayed"
      },
      "art_design": null
    },
    {
      "id": 325,
      "name": "University of Milan, Italy",
      "aliases": [],
      "source_group": "Exchange Programme",
      "overall": null,
      "art_design": null
    },
    {
      "id": 326,
      "name": "Université de Montréal",
      "aliases": [
        "University of Montreal, Canada"
      ],
      "source_group": "Exchange Programme",
      "overall": {
        "edition": 2027,
        "rank": "=162",
        "score": null,
        "source_url": "https://www.topuniversities.com/universities/universite-de-montreal",
        "verification": "previously_displayed"
      },
      "art_design": null
    },
    {
      "id": 327,
      "name": "University of Navarra",
      "aliases": [
        "University of Navarra, Spain"
      ],
      "source_group": "Exchange Programme",
      "overall": {
        "edition": 2027,
        "rank": "=279",
        "score": null,
        "source_url": "https://www.topuniversities.com/universities/university-navarra",
        "verification": "previously_displayed"
      },
      "art_design": null
    },
    {
      "id": 328,
      "name": "University of Technology Sydney",
      "aliases": [
        "University of Technology Sydney, Australia"
      ],
      "source_group": "Exchange Programme",
      "overall": {
        "edition": 2027,
        "rank": "=87",
        "score": null,
        "source_url": "https://www.topuniversities.com/universities/university-technology-sydney",
        "verification": "previously_displayed"
      },
      "art_design": null
    },
    {
      "id": 329,
      "name": "University of Wuppertal",
      "aliases": [
        "University of Wuppertal, Germany"
      ],
      "source_group": "Exchange Programme",
      "overall": {
        "edition": 2027,
        "rank": "1001–1200",
        "score": null,
        "source_url": "https://www.topuniversities.com/universities/bergische-universitat-wuppertal",
        "verification": "previously_displayed"
      },
      "art_design": null
    },
    {
      "id": 330,
      "name": "University of Zaragoza, Spain",
      "aliases": [],
      "source_group": "Exchange Programme",
      "overall": null,
      "art_design": null
    },
    {
      "id": 338,
      "name": "Victoria University (Sydney Campus), Australia",
      "aliases": [],
      "source_group": "Exchange Programme",
      "overall": null,
      "art_design": null
    },
    {
      "id": 341,
      "name": "Virginia Tech",
      "aliases": [
        "Virginia Tech, USA"
      ],
      "source_group": "Exchange Programme",
      "overall": {
        "edition": 2027,
        "rank": "366",
        "score": null,
        "source_url": "https://www.topuniversities.com/universities/virginia-polytechnic-institute-state-university",
        "verification": "previously_displayed"
      },
      "art_design": null
    },
    {
      "id": 20001,
      "name": "Central Academy of Fine Arts (CAFA)",
      "aliases": [],
      "source_group": "Academic Collaboration",
      "overall": null,
      "art_design": {
        "edition": 2026,
        "rank": "14",
        "score": 76.4,
        "source_url": "https://www.topuniversities.com/university-subject-rankings/art-design",
        "verification": "qs_subject_2026"
      }
    },
    {
      "id": 20002,
      "name": "Tongji University",
      "aliases": [],
      "source_group": "Academic Collaboration",
      "overall": null,
      "art_design": {
        "edition": 2026,
        "rank": "16",
        "score": 75.4,
        "source_url": "https://www.topuniversities.com/university-subject-rankings/art-design",
        "verification": "qs_subject_2026"
      }
    },
    {
      "id": 20003,
      "name": "Indian Institute of Technology Bombay (IIT Bombay)",
      "aliases": [],
      "source_group": "Exchange Programme",
      "overall": null,
      "art_design": null
    },
    {
      "id": 20004,
      "name": "China Academy of Art (CAA)",
      "aliases": [],
      "source_group": "Academic Collaboration",
      "overall": null,
      "art_design": null
    },
    {
      "id": 20005,
      "name": "Princess Nourah bint Abdulrahman University (PNU)",
      "aliases": [],
      "source_group": "Academic Collaboration",
      "overall": null,
      "art_design": null
    }
  ]
};
const normalize=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
const byId=new Map(),byName=new Map();
for(const record of data.partners){
  if(record?.id!==null&&record?.id!==undefined)byId.set(String(record.id),record);
  for(const name of [record.name,...(record.aliases||[])]){const key=normalize(name);if(key&&!byName.has(key))byName.set(key,record);}
}
window.SDCA_V2_QS_RANKINGS={
 data,
 lookup(name,featureId){
  if(featureId!==undefined&&featureId!==null&&byId.has(String(featureId)))return byId.get(String(featureId));
  return byName.get(normalize(name))||null;
 },
 home(){return data.home_university},
 formatRank(value){const text=String(value??'').trim().replace(/^#?\s*=\s*/,'').replace(/^#\s*/,'');return text?'#'+text:null;},
 formatScore(value){return Number.isFinite(value)?value.toFixed(1):null;}
};
})();
