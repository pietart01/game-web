const {executeQuery} = require("../config/database");

async function main() {
    const result = await executeQuery(`select 1+1`);
    console.log(result);
}

main()