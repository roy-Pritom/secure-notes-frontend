module.exports = {
    apps: [
        {
            script: "node_modules/next/dist/bin/next",
            watch: false,
            exec_mode: "cluster",
            name: "[STAGE] Secure note - Frontend",
            cwd: __dirname,
            instances: "1",
            args: "start",
            max_memory_restart: "800M",
            autorestart: true,
            env: {
                NODE_ENV: "staging",
                PORT: 8085,
            },
        },
    ],
};
