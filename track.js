let trackingId = "";
let keyWord = "#123";

let userData = {
    VisitId: "d2b638bc-a8cd-413b-9eff-6ba751ef560c",
    VisitorId: "69b25f50-2779-42d7-9fe4-bcbfe4322b01",
    ClientGuid: "a502bdce1b9b407aadcd5d63973911f7"
}

function generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const baseConverter =()=> {
    let convertableData = {
        "QueryId":generateGuid(),
        "TrackingId": trackingId,
        "TypeId":1,
        "ViewportHeight":window.innerHeight,
        "ViewportWidth":window.innerWidth,
        "keyword":keyWord
    }
    return btoa(JSON.stringify(convertableData));       
}

const searchRunner = async () => {
    const url = 'https://essearchapi-na.hawksearch.com/api/v2/search';
    const data = {
        "ClientData": {
            "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
        },
        "VisitId": userData.VisitId,
        "VisitorId": userData.VisitorId,
        "ClientGuid": userData.ClientGuid,
        "FacetSelections": {},
        "Keyword": keyWord,
        "PageNo": "1",
        "MaxPerPage": "20",
        "Variants": {}
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-HawkSearch-IgnoreTracking': 'true/false',
        },
        body: JSON.stringify(data),
    };

    await fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            trackingId = data.TrackingId;
        })
        .catch(error => {
            console.error('Error during POST request:', error);
        });
};


const trackRunner = async () => {
    let url = "https://tracking-na.hawksearch.com/api/trackevent";

    const data = {
        "ClientGuid": userData.ClientGuid,
        "EventType": 2,
        "VisitId": userData.VisitId,
        "VisitorId": userData.VisitorId,
        "EventData": baseConverter(),
    }

    console.log("tia : ", data);

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-HawkSearch-IgnoreTracking': 'true/false',
        },
        body: JSON.stringify(data),
    };

    await fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response;
        })
        .then(data => {
            console.log(JSON.parse(JSON.stringify(data)));
        })
        .catch(error => {
            console.error('Error during POST request:', error);
        });


};

const runQueries =()=>{
    searchRunner();  
    trackRunner();  
}