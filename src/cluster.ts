import { Cluster } from 'puppeteer-cluster'

let clusterInstance: Cluster

async function initCluster() {
    clusterInstance = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_PAGE,
        maxConcurrency: 3,
        puppeteerOptions: {
            headless: true,
        },
    });
}

function getCluster() {
    if (!clusterInstance) throw new Error('Cluster not initialized');
    return clusterInstance;
}

async function closeCluster() {
    if (clusterInstance) {
        await clusterInstance.idle();
        await clusterInstance.close();
    }
}

export { initCluster, getCluster, closeCluster }