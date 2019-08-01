import { shallowMount } from '@vue/test-utils';
import Table from '@/components/table.vue';
import Search from '@/components/search.vue';

import flushPromises from 'flush-promises';

const tableDataFixtures = [{
    currency:47192,
    disabled:true,
    doc_id:"gYFNHmP733PvBsfb8NCR",
    id:"8d6f80f0-8d9f-4c0a-973c-a7769e1a2188",
    location:"Campurrejo",
    name:"Bluezoom"
}];

describe('Table.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Table);
    });

    it('is a Vue instance', () => {
        expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it('is Table', () => {
        expect(wrapper.is(Table)).toBe(true);
    });

    it('isCurrency \'currency\'', () => {
        expect(wrapper.vm.isCurrency('currency')).toBe(true);
    });

    it('isCurrency \'location\'', () => {
        expect(wrapper.vm.isCurrency('location')).toBe(false);
    });

    it('render table component', () => {
        expect(wrapper.classes('container')).toBe(true);
    });

    it('render component search', () => {
        wrapper.setData({ loading: false });
        expect(wrapper.contains(Search)).toBe(true)
    });

    it('set loading to false', async () => {
        wrapper.setData({ loading: false });
        wrapper.setData({ tableData: tableDataFixtures});
        await flushPromises();
        expect(wrapper.vm.loading).toBe(false)
    });
});
