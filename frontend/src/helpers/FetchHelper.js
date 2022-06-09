export async function fetchJson(url, init) {
    let ok = false;
    let isValid = true;
    let json = null;
    let errors = [];

    try {
        const response = await fetch(url, init);

        ok = response.ok;
        const text = await response.text();

        try {
            json = JSON.parse(text);
    
            if (!ok) {
                if (Array.isArray(json)) { // Validation errors
                    json.forEach(error => {
                        if (error.hasOwnProperty("field") && error.hasOwnProperty("message")) {
                            const field = error["field"];
                            const message = error["message"];
                            errors.push({ field, message });
                        }
                    });
                } else if (json.hasOwnProperty("message")) {
                    const field = "general";
                    const message = JSON.stringify(json["message"]);
                    errors.push({ field, message });
                } else {
                    const field = "unknown";
                    const message = JSON.stringify(json);
                    errors.push({ field, message });
                }
            }
        } catch (e) {
            isValid = false;
        }
    } catch(error) {
        ok = false;
        const field = "unknown";
        const message = error.message;
        errors.push({ field, message });
    }

    return { ok, isValid, json, errors };
}