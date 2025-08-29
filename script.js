// Handles the Bitrix24 placement integration
document.addEventListener('DOMContentLoaded', function() {
    if (window === window.top) {
        // Not in an iframe -> local test mode
        document.getElementById('app-content').style.display = 'block';
        document.getElementById('placement-handler').style.display = 'none';

        console.log("Running in LOCAL MODE, using simulated data...");

        // Simulated placement data (for testing outside Bitrix24)
        const simulatedData = {
            DOMAIN: 'instloo.bitrix24.com',
            PROTOCOL: '1',
            LANG: 'en',
            member_id: '7d0341d4bed8daaee39ff8d17568bcbc',
            PLACEMENT: 'CRM_DEAL_DETAIL_TOOLBAR'
        };
        handlePlacementData(simulatedData);

    } else {
        // Running inside Bitrix24 (iframe)
        document.getElementById('app-content').style.display = 'none';
        document.getElementById('placement-handler').style.display = 'block';

        initBitrixApp();
    }
});

// Initialize the Bitrix24 app
function initBitrixApp() {
    BX24.init(function() {
        console.log("Bitrix24 app initialized");

        // Get auth info
        const auth = BX24.getAuth();
        console.log("Auth Data:", auth);

        // Get placement info
        const placementInfo = BX24.placement.info();
        console.log("Placement Info:", placementInfo);

        // Build placement data object similar to local simulation
        const placementData = {
            ...auth,
            PLACEMENT: placementInfo.placement,
            PLACEMENT_OPTIONS: JSON.stringify(placementInfo.options || {})
        };

        handlePlacementData(placementData);
    });
}

// Handle placement data
function handlePlacementData(data) {
    console.log("Received placement data:", data);

    let placementOptions = {};
    try {
        placementOptions = JSON.parse(data.PLACEMENT_OPTIONS || '{}');
    } catch (e) {
        console.error("Error parsing PLACEMENT_OPTIONS", e);
    }

    const dealId = placementOptions.ID;
    document.getElementById('deal-id').textContent = dealId || 'Not available';

    if (dealId) {
        document.getElementById('fetch-deal-info').addEventListener('click', function() {
            fetchDealDetails(dealId, data.AUTH_ID);
        });

        document.getElementById('perform-action').addEventListener('click', function() {
            performCustomAction(dealId);
        });
    }
}

// Fetch deal details from Bitrix24 REST API
function fetchDealDetails(dealId, authToken) {
    const dealInfoDiv = document.getElementById('deal-info');
    dealInfoDiv.innerHTML = '<p>Fetching deal information...</p>';

    // If running inside Bitrix24, call the API
    if (typeof BX24 !== "undefined") {
        BX24.callMethod(
            "crm.deal.get",
            { id: dealId },
            function(result) {
                if (result.error()) {
                    dealInfoDiv.innerHTML = `<p style="color:red;">Error: ${result.error()}</p>`;
                } else {
                    const dealData = result.data();
                    let html = '<h4>Deal Information</h4><ul>';
                    for (const [key, value] of Object.entries(dealData)) {
                        html += `<li><strong>${key}:</strong> ${value}</li>`;
                    }
                    html += '</ul>';
                    dealInfoDiv.innerHTML = html;
                }
            }
        );
    } else {
        // Local simulation
        setTimeout(() => {
            const dealData = {
                ID: dealId,
                TITLE: `Deal #${dealId} (simulated)`,
                STAGE_ID: "C1:NEW",
                PROBABILITY: 50,
                OPPORTUNITY: 10000,
                CURRENCY_ID: "USD"
            };

            let html = '<h4>Deal Information</h4><ul>';
            for (const [key, value] of Object.entries(dealData)) {
                html += `<li><strong>${key}:</strong> ${value}</li>`;
            }
            html += '</ul>';
            dealInfoDiv.innerHTML = html;
        }, 1000);
    }
}

// Custom action simulation
function performCustomAction(dealId) {
    const dealInfoDiv = document.getElementById('deal-info');
    dealInfoDiv.innerHTML = '<p>Performing custom action...</p>';

    setTimeout(() => {
        dealInfoDiv.innerHTML = `
            <div style="color: green;">
                <h4>Action Completed Successfully!</h4>
                <p>Custom action performed on Deal #${dealId}</p>
                <p>Timestamp: ${new Date().toLocaleString()}</p>
            </div>
        `;
    }, 1500);
}
