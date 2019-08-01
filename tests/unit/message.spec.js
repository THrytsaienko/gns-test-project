import { shallowMount } from '@vue/test-utils'
import Message from '@/components/message.vue'

describe('Message.vue', () => {
    it('renders search input', () => {
        const wrapper = shallowMount(Message, {
            propsData: {
                text: 'text',
                color: 'red'
            }
        });
        expect(wrapper.props().text).toBe('text');
        expect(wrapper.props().color).toBe('red');
    });

    it('show alert', () => {
        const wrapper = shallowMount(Message);
        expect(wrapper.classes('message')).toBe(true);
        expect(wrapper.classes()).toContain('message');
    });
});
