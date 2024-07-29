export { colors };

const url = "https://www.csscolorsapi.com/api/colors/group/purple";

async function getColors(url) {
    const response = await fetch(url);
    const results = await response.json();
    const colors = await results.colors;

    const colorCodes = []
    colors.forEach((color) => {
        colorCodes.push(`#${color.hex}`);
    });

    return colorCodes;
}

const colors = await getColors(url);
