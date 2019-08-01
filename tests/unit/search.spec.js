import { mount } from '@vue/test-utils'
import Search from '@/components/search.vue'

describe('Search.vue', () => {
  it('renders search input', () => {
    const wrapper = mount(Search);
    expect(wrapper.html())
        .toContain('<div><input type="text" placeholder="Search"></div>')
  });

  it('emit search input', () => {
    const wrapper = mount(Search);
    wrapper.vm.$emit('input');
    expect(wrapper.emitted().input).toBeTruthy();
  });
})
