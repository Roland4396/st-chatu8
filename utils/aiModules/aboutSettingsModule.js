export const aboutSettingsModule = {
  name: "关于设置助手",
  summary: "帮助用户了解智绘姬插件的版本信息、更新检查、项目链接、开发者信息等。当用户询问版本号、如何更新、项目地址、作者信息等问题时加载此模块。",
  commands: "\n【关于页面可用命令】\n\n■ 基础导航命令\n\n切换到关于页面：\n<SystemQuery>{\"type\": \"ui_action\", \"action\": \"switch_tab_about\"}</SystemQuery>\n\n■ 版本管理命令\n\n检查更新：\n<SystemQuery>{\"type\": \"ui_action\", \"action\": \"check_updates\"}</SystemQuery>\n\n查询当前版本：\n<SystemQuery>{\"type\": \"read\", \"path\": \"version\"}</SystemQuery>\n".trim(),
  knowledge: "\n【关于页面功能说明】\n\n■ 版本信息区域\n- 当前版本号：显示智绘姬插件的当前版本\n- 版本发布日期：当前版本的发布时间\n- 版本状态：显示是否为最新版本\n\n■ 更新检查区域\n- 检查更新按钮：手动检查是否有新版本可用\n- 自动更新提示：发现新版本时会在设置面板标题栏显示提示\n- 更新日志：查看新版本的更新内容和改进\n\n■ 项目信息区域\n- 项目名称：智绘姬 (SillyTavern Chatu8)\n- 项目描述：SillyTavern 的图片生成扩展插件\n- 开源协议：项目使用的开源许可证信息\n".trim(),
  workflow: "\n【关于页面引导流程】\n\n■ 查看版本信息流程\n1. 切换到关于页面：\n   <SystemQuery>{\"type\": \"ui_action\", \"action\": \"switch_tab_about\"}</SystemQuery>\n2. 查看当前版本号和发布日期\n3. 了解当前版本的主要特性\n\n■ 检查更新流程\n1. 切换到关于页面\n2. 点击\"检查更新\"按钮或使用命令：\n   <SystemQuery>{\"type\": \"ui_action\", \"action\": \"check_updates\"}</SystemQuery>\n3. 等待检查结果\n4. 如有新版本，查看更新日志\n5. 按照提示进行更新\n".trim(),
  errorGuide: "\n【关于页面常见问题】\n\n■ 版本信息问题\n- 版本号不显示：\n  * 刷新页面重新加载\n  * 检查插件是否正确安装\n  * 查看浏览器控制台错误信息\n\n■ 更新检查问题\n- 无法检查更新：\n  * 检查网络连接是否正常\n  * 确认更新服务器是否可访问\n  * 查看防火墙设置\n  * 稍后再试\n- 检查更新一直转圈：\n  * 网络连接可能较慢\n  * 等待超时后重试\n  * 检查是否被代理或防火墙拦截\n".trim()
};