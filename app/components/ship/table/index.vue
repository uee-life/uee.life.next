<template>
    <vue-good-table class="ship-table"
        :columns="columns"
        :rows="ships"
        theme="ueelife"
        :search-options="search"
        :pagination-options="pagination">
        <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'id'">
                <span>{{ shipID(props.row.id) }}</span>
            </span>
            <span v-else>
                {{props.formattedRow[props.column.field]}}
            </span>
        </template>
    </vue-good-table>
</template>

<script setup>
const props = defineProps({
    ships: {
        type: Object,
        required: true
    }
})

const search = {
    enabled: false
}

const pagination = {
    enabled: true,
    position: top
}

const columns = [
    {
        label: 'Ship-ID',
        field: 'id'
    },
    {
        label: 'Manufacturer',
        field: 'manufacturer'
    },
    {
        label: 'Model',
        field: 'model'
    },
    {
        label: 'Name',
        field: 'name'
    },
    {
        label: 'Career',
        field: 'career'
    },
    {
        label: 'Role',
        field: 'role'
    },
    {
        label: 'Crew',
        field: 'max_crew',
        type: 'number'
    },
    {
        label: 'Cargo',
        field: 'cargo',
        type: 'number'
    }
]

/*export default {
    name: 'ship-table',
    props: ["ships"],
    data() {
        return {
            columns: [
                {
                    label: 'Ship-ID',
                    field: 'id'
                },
                {
                    label: 'Manufacturer',
                    field: 'make'
                },
                {
                    label: 'Model',
                    field: 'model'
                },
                {
                    label: 'Name',
                    field: 'name'
                },
                {
                    label: 'Role',
                    field: 'type'
                },
                {
                    label: 'Focus',
                    field: 'focus'
                },
                {
                    label: 'Crew',
                    field: 'max_crew',
                    type: 'number'
                },
                {
                    label: 'Cargo',
                    field: 'cargo',
                    type: 'number'
                }
            ],
            search: {
                enabled: false,
                
            },
            pagination: {
                enabled: true,
                position: 'top'
            }
        }
    }
}*/
</script>

<style>
    .ship-table {
        width: 100%;
    }

    .vgt-table.ueelife {
        border: 1px solid blue;
        background-color: transparent;
    }

    .vgt-table.bordered td, .vgt-table.bordered th  {
        border: 1px solid #546f84;
    }

    .vgt-table.ueelife thead th {
        color: #39ced8;
        background: rgba(13, 46, 66, 0.8);
    }

    .vgt-table.ueelife td {
        color: #39ced8;
        background: url('/_nuxt/assets/fading-bars.png') repeat;
    }

    .vgt-wrap__footer {
        color: #39ced8;
        border: 1px solid #546f84;
        background: rgba(13, 46, 66, 0.8);
        margin-bottom: 10px;
    }
</style>