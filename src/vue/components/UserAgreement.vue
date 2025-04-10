<template>
  <div>
    <!-- 触发按钮 -->
    <button @click="showModal" class="text-primary-700 hover:underline dark:text-primary-500" type="button">
      《用户协议》
    </button>

    <!-- 模态框 -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 p-4">
      <div class="relative w-full max-w-2xl max-h-[80vh]">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700 overflow-hidden">
          <!-- Modal header -->
          <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600 sticky top-0 bg-white dark:bg-gray-700">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              用户使用守则
            </h3>
            <button @click="hideModal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span class="sr-only">关闭</span>
            </button>
          </div>

					<!-- Modal body -->
					<div class="overflow-y-auto max-h-[60vh] p-4 md:p-5 space-y-4">
						<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">本人（以下简称"我"）郑重承诺遵守以下条款，如有违反本承诺书有关条款的行为，由本单位承担由此带来的一切民事、行政和刑事责任。</p>
						
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">1. 遵守法律法规</h2>
						<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">我承诺遵守《中华人民共和国计算机信息系统安全保护条例》和《计算机信息网络国际联网安全保护管理办法》及其他国家有关法律、法规和行政规章制度。</p>
						
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">2. 信息安全</h2>
						<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">我承诺不利用网络危害国家安全、泄露国家秘密，不侵犯国家的、社会的、集体的利益和第三方的合法权益，不从事违法犯罪活动。</p>
						
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">3. 网络安全管理</h2>
						<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">我承诺严格按照国家相关的法律法规做好本单位网站的信息安全管理工作，按政府有关部门要求设立信息安全责任人和信息安全审查员。</p>
						
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">4. 禁止传播有害信息</h2>
						<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">我承诺不制作、复制、查阅和传播下列信息：</p>
						<ul>
								<li class="text-base leading-relaxed text-gray-500 dark:text-gray-400">反对宪法所确定的基本原则的；</li>
								<li class="text-base leading-relaxed text-gray-500 dark:text-gray-400">危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</li>
								<li class="text-base leading-relaxed text-gray-500 dark:text-gray-400">损害国家荣誉和利益的；</li>
								<li class="text-base leading-relaxed text-gray-500 dark:text-gray-400">煽动民族仇恨、民族歧视，破坏民族团结的；</li>
								<li class="text-base leading-relaxed text-gray-500 dark:text-gray-400">破坏国家宗教政策，宣扬邪教和封建迷信的；</li>
								<li class="text-base leading-relaxed text-gray-500 dark:text-gray-400">散布谣言，扰乱社会秩序，破坏社会稳定的；</li>
								<li class="text-base leading-relaxed text-gray-500 dark:text-gray-400">散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</li>
								<li class="text-base leading-relaxed text-gray-500 dark:text-gray-400">侮辱或者诽谤他人，侵害他人合法权益的；</li>
								<li class="text-base leading-relaxed text-gray-500 dark:text-gray-400">含有法律、行政法规禁止的其他内容的。</li>
						</ul>
						
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">5. 网络安全活动</h2>
						<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">我承诺不从事下列危害计算机信息网络安全的活动：</p>
						<ul>
								<li class="text-base leading-relaxed text-gray-500 dark:text-gray-400">未经允许，进入计算机信息网络或者使用计算机信息网络资源的；</li>
								<li class="text-base leading-relaxed text-gray-500 dark:text-gray-400">未经允许，对计算机信息网络功能进行删除、修改或者增加的；</li>
								<li class="text-base leading-relaxed text-gray-500 dark:text-gray-400">未经允许，对计算机信息网络中存储或者传输的数据和应用程序进行删除、修改或者增加的；</li>
								<li class="text-base leading-relaxed text-gray-500 dark:text-gray-400">故意制作、传播计算机病毒等破坏性程序的；</li>
								<li class="text-base leading-relaxed text-gray-500 dark:text-gray-400">其他危害计算机信息网络安全的。</li>
						</ul>
						
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">6. 应急措施</h2>
						<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">我承诺当计算机信息系统发生重大安全事故时，立即采取应急措施，保留有关原始记录，并在24小时内向政府监管部门报告并书面知会贵单位。</p>
						
					</div>

          <!-- Modal footer -->
          <div class="flex items-center p-4 border-t border-gray-200 rounded-b dark:border-gray-600 sticky bottom-0 bg-white dark:bg-gray-700">
            <button @click="accept" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              我认真阅读并接受
            </button>
            <button @click="hideModal" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              我拒绝
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserAgreement',
  data() {
    return {
      isModalOpen: false
    }
  },
  methods: {
    showModal() {
      this.isModalOpen = true
      document.body.style.overflow = 'hidden'
    },
    hideModal() {
      this.isModalOpen = false
      document.body.style.overflow = 'auto'
    },
    accept() {
      this.$emit('agreement-accepted')
      this.hideModal()
    }
  }
}
</script>
