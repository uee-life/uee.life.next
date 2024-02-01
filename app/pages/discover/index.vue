<template>
    <div>
        <widgets-no-result text="Coming Soon..." />
        <!--latest-pois />
        <geolocate /-->
    </div>
</template>

<script>
import Geolocate from '@/components/discover/Geolocate'
import LatestPois from '@/components/discover/LatestPOIs'
export default {
    name: 'Explore',
    components: {
        Geolocate,
        LatestPois
    }
}
</script>

<style>

</style>