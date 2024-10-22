// This needs to be private to org members

// Public
// Public
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const group = await getOrgGroup(id)
    if (group) {
        return apiSuccess(group)
    } else {
        return apiError(event, 'Org not found')
    }
    
})




/* Data Example
    "org": {
      "name": "McBane Enterprises",
      "description": "McBane enterprises. We aim to misbehave.\n\nGet a crew, get a job, keep flying.\n\nFor Science!\n\nhttp://twitch.tv/Capn_Flint\n  ",
      "official": false,
      "logo": "https://robertsspaceindustries.com/media/2weountodg09pr/logo/MCBANE-Logo.png",
      "id": "MCBANE",
      "type": "Organization"
    },
    "admins": [
      {
        "name": "Flint McBane",
        "handle": "Capn_Flint",
        "rank": 5,
        "portrait": "https://robertsspaceindustries.com/media/4v5c0bivhvd6qr/heap_infobox/FlintMcBane7.jpg",
        "verified": true,
        "status": {
          "active": "online",
          "last": "2024-10-21T14:02:10.210Z"
        }
      },
      {
        "website": "http://twitch.tv/Capn_Flint",
        "record": "#84348",
        "name": "Flint McBane",
        "verified": true,
        "bio": "\n                Director of McBane Enterprises.\n\nCaptain of the Good Ship Narwhal. \n\nEntirely \"Legitimate\" businessman.\n\nI haul, retrieve, recover whatever you need... for a price.\n\nYarr!!!!\n\n[ueelife:23aa5551-8ddc-49e3-a3b0-af515b1b1e06]\n              ",
        "handle": "Capn_Flint",
        "id": "CAPN_FLINT",
        "enlisted": "Nov 18, 2012",
        "portrait": "https://robertsspaceindustries.com/media/4v5c0bivhvd6qr/heap_infobox/FlintMcBane7.jpg"
      }
    ],
    "fleet": {
      "purpose": "General Ops",
      "cmdr": "Capn_Flint",
      "name": "First Fleet",
      "id": "B9A4FB9D"
    },
    "info": {
      "purpose": "General Ops",
      "cmdr": "Capn_Flint",
      "name": "First Fleet",
      "id": "B9A4FB9D"
    },
    "cmdr": {
      "website": "http://twitch.tv/Capn_Flint",
      "record": "#84348",
      "name": "Flint McBane",
      "verified": true,
      "bio": "\n                Director of McBane Enterprises.\n\nCaptain of the Good Ship Narwhal. \n\nEntirely \"Legitimate\" businessman.\n\nI haul, retrieve, recover whatever you need... for a price.\n\nYarr!!!!\n\n[ueelife:23aa5551-8ddc-49e3-a3b0-af515b1b1e06]\n              ",
      "handle": "Capn_Flint",
      "id": "CAPN_FLINT",
      "enlisted": "Nov 18, 2012",
      "portrait": "https://robertsspaceindustries.com/media/4v5c0bivhvd6qr/heap_infobox/FlintMcBane7.jpg",
      "status": {
        "active": "online",
        "last": "2024-10-21T14:02:10.210Z"
      },
      "orgs": {
        "main": {
          "id": "MCBANE",
          "name": "McBane Enterprises",
          "logo": "https://robertsspaceindustries.com/media/2weountodg09pr/logo/MCBANE-Logo.png",
          "rank": {
            "title": "Director",
            "level": 5
          }
        },
        "affiliated": []
      }
    },
    "groups": [
      {
        "org": {
          "name": "McBane Enterprises",
          "description": "McBane enterprises. We aim to misbehave.\n\nGet a crew, get a job, keep flying.\n\nFor Science!\n\nhttp://twitch.tv/Capn_Flint\n  ",
          "official": false,
          "logo": "https://robertsspaceindustries.com/media/2weountodg09pr/logo/MCBANE-Logo.png",
          "id": "MCBANE",
          "type": "Organization"
        },
        "admins": [
          {
            "name": "Flint McBane",
            "handle": "Capn_Flint",
            "rank": 5,
            "portrait": "https://robertsspaceindustries.com/media/4v5c0bivhvd6qr/heap_infobox/FlintMcBane7.jpg",
            "verified": true,
            "status": {
              "active": "online",
              "last": "2024-10-21T14:02:10.210Z"
            }
          },
          {
            "website": "",
            "record": "#908174",
            "verified": true,
            "name": "El Capitan",
            "bio": "\n                [ueelife:88febcfa-0f06-4829-a5c1-da62134f3446]\n              ",
            "handle": "Capn_Nemo",
            "id": "CAPN_NEMO",
            "enlisted": "Jun 10, 2015",
            "portrait": "https://robertsspaceindustries.com/media/oypqw6bjntqh0r/heap_infobox/MV5BM2VmYWRjY2QtOTRiNy00ZDIyLWIzNDAtOTBjOWFlYmI1NjQ2XkEyXkFqcGdeQXVyNzU1NzE3NTg-_V1_.jpg"
          },
          {
            "website": "http://twitch.tv/Capn_Flint",
            "record": "#84348",
            "name": "Flint McBane",
            "verified": true,
            "bio": "\n                Director of McBane Enterprises.\n\nCaptain of the Good Ship Narwhal. \n\nEntirely \"Legitimate\" businessman.\n\nI haul, retrieve, recover whatever you need... for a price.\n\nYarr!!!!\n\n[ueelife:23aa5551-8ddc-49e3-a3b0-af515b1b1e06]\n              ",
            "handle": "Capn_Flint",
            "id": "CAPN_FLINT",
            "enlisted": "Nov 18, 2012",
            "portrait": "https://robertsspaceindustries.com/media/4v5c0bivhvd6qr/heap_infobox/FlintMcBane7.jpg"
          }
        ],
        "fleet": {
          "purpose": "General Ops",
          "cmdr": "Capn_Flint",
          "name": "First Fleet",
          "id": "B9A4FB9D"
        },
        "info": {
          "purpose": "",
          "cmdr": "Capn_Nemo",
          "name": "Bravo Wing",
          "id": "62D9438D"
        },
        "cmdr": {
          "website": "",
          "record": "#908174",
          "verified": true,
          "name": "El Capitan",
          "bio": "\n                [ueelife:88febcfa-0f06-4829-a5c1-da62134f3446]\n              ",
          "handle": "Capn_Nemo",
          "id": "CAPN_NEMO",
          "enlisted": "Jun 10, 2015",
          "portrait": "https://robertsspaceindustries.com/media/oypqw6bjntqh0r/heap_infobox/MV5BM2VmYWRjY2QtOTRiNy00ZDIyLWIzNDAtOTBjOWFlYmI1NjQ2XkEyXkFqcGdeQXVyNzU1NzE3NTg-_V1_.jpg",
          "status": {
            "active": "offline",
            "last": "2024-10-20T08:19:04.691Z"
          },
          "orgs": {
            "main": {
              "id": "MCBANE",
              "name": "McBane Enterprises",
              "logo": "https://robertsspaceindustries.com/media/2weountodg09pr/logo/MCBANE-Logo.png",
              "rank": {
                "title": "Department Head",
                "level": 4
              }
            },
            "affiliated": []
          }
        },
        "groups": [
          {
            "org": {
              "name": "McBane Enterprises",
              "description": "McBane enterprises. We aim to misbehave.\n\nGet a crew, get a job, keep flying.\n\nFor Science!\n\nhttp://twitch.tv/Capn_Flint\n  ",
              "official": false,
              "logo": "https://robertsspaceindustries.com/media/2weountodg09pr/logo/MCBANE-Logo.png",
              "id": "MCBANE",
              "type": "Organization"
            },
            "admins": [
              {
                "name": "Flint McBane",
                "handle": "Capn_Flint",
                "rank": 5,
                "portrait": "https://robertsspaceindustries.com/media/4v5c0bivhvd6qr/heap_infobox/FlintMcBane7.jpg",
                "verified": true,
                "status": {
                  "active": "online",
                  "last": "2024-10-21T14:02:10.210Z"
                }
              },
              {
                "website": "",
                "record": "#908174",
                "verified": true,
                "name": "El Capitan",
                "bio": "\n                [ueelife:88febcfa-0f06-4829-a5c1-da62134f3446]\n              ",
                "handle": "Capn_Nemo",
                "id": "CAPN_NEMO",
                "enlisted": "Jun 10, 2015",
                "portrait": "https://robertsspaceindustries.com/media/oypqw6bjntqh0r/heap_infobox/MV5BM2VmYWRjY2QtOTRiNy00ZDIyLWIzNDAtOTBjOWFlYmI1NjQ2XkEyXkFqcGdeQXVyNzU1NzE3NTg-_V1_.jpg"
              },
              {
                "website": "http://twitch.tv/Capn_Flint",
                "record": "#84348",
                "name": "Flint McBane",
                "verified": true,
                "bio": "\n                Director of McBane Enterprises.\n\nCaptain of the Good Ship Narwhal. \n\nEntirely \"Legitimate\" businessman.\n\nI haul, retrieve, recover whatever you need... for a price.\n\nYarr!!!!\n\n[ueelife:23aa5551-8ddc-49e3-a3b0-af515b1b1e06]\n              ",
                "handle": "Capn_Flint",
                "id": "CAPN_FLINT",
                "enlisted": "Nov 18, 2012",
                "portrait": "https://robertsspaceindustries.com/media/4v5c0bivhvd6qr/heap_infobox/FlintMcBane7.jpg"
              }
            ],
            "fleet": {
              "purpose": "General Ops",
              "cmdr": "Capn_Flint",
              "name": "First Fleet",
              "id": "B9A4FB9D"
            },
            "info": {
              "purpose": "",
              "cmdr": "",
              "name": "Red Squadron",
              "id": "4DB2BA0E"
            },
            "cmdr": "",
            "groups": []
          }
        ]
      },
      {
        "org": {
          "name": "McBane Enterprises",
          "description": "McBane enterprises. We aim to misbehave.\n\nGet a crew, get a job, keep flying.\n\nFor Science!\n\nhttp://twitch.tv/Capn_Flint\n  ",
          "official": false,
          "logo": "https://robertsspaceindustries.com/media/2weountodg09pr/logo/MCBANE-Logo.png",
          "id": "MCBANE",
          "type": "Organization"
        },
        "admins": [
          {
            "name": "Flint McBane",
            "handle": "Capn_Flint",
            "rank": 5,
            "portrait": "https://robertsspaceindustries.com/media/4v5c0bivhvd6qr/heap_infobox/FlintMcBane7.jpg",
            "verified": true,
            "status": {
              "active": "online",
              "last": "2024-10-21T14:02:10.210Z"
            }
          },
          {
            "website": "http://twitch.tv/Capn_Flint",
            "record": "#84348",
            "name": "Flint McBane",
            "verified": true,
            "bio": "\n                Director of McBane Enterprises.\n\nCaptain of the Good Ship Narwhal. \n\nEntirely \"Legitimate\" businessman.\n\nI haul, retrieve, recover whatever you need... for a price.\n\nYarr!!!!\n\n[ueelife:23aa5551-8ddc-49e3-a3b0-af515b1b1e06]\n              ",
            "handle": "Capn_Flint",
            "id": "CAPN_FLINT",
            "enlisted": "Nov 18, 2012",
            "portrait": "https://robertsspaceindustries.com/media/4v5c0bivhvd6qr/heap_infobox/FlintMcBane7.jpg"
          }
        ],
        "fleet": {
          "purpose": "General Ops",
          "cmdr": "Capn_Flint",
          "name": "First Fleet",
          "id": "B9A4FB9D"
        },
        "info": {
          "purpose": "",
          "cmdr": "",
          "name": "Alpha Wing",
          "id": "06764C90"
        },
        "cmdr": "",
        "groups": []
      }
    ]
  }
}

*/