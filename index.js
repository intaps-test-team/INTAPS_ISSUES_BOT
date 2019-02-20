const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const Router = require('telegraf/Router')
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const WizardScene = require('telegraf/scenes/wizard')
const DBhandler = require('./DBhandler')

//telegram bot token
const bot = new Telegraf('790840');
//to check the log optional
bot.use(Telegraf.log())
 // variable to store issue information
var Issue_info = null
//start command menu
bot.command('start', (ctx) =>{
  ctx.reply(`Hello ${ctx.from.first_name} \n Plase Choose ISSUE Task`, 
  	Markup.keyboard([
      ['Create', 'Close'], 
      ['Track', 'Re-open'], 
      [ 'Re-Solve']
    ])
    .oneTime()
    .extra()
  )}
)
// to know what is clicked and call a function
bot.hears('Create',(ctx)=>{return create_issue (ctx)})
bot.hears('Close',(ctx)=>{return close_issue (ctx)})
bot.hears('Track',(ctx)=>{return track_issue (ctx)})
bot.hears('Re-open',(ctx)=>{return Re_open_issue (ctx)})
bot.hears('Re-Solve',(ctx)=>{return Re_solve_issue (ctx)})

function close_issue(ctx){
	ctx.reply("close issue avaliable soon thanks")
}
function track_issue(ctx){
	ctx.reply("Track issue avaliable soon thanks")
}
function Re_open_issue(ctx){
	ctx.reply("Re-open Issue avaliable soon thanks")
}
function Re_solve_issue(ctx){
 
}
function create_issue(ctx){
	// display all avaliable projects
	ctx.reply('Choose Project', 
		Markup.keyboard([
			['CAMIS', 'NRALIS'],
      ['WISI', 'DAMS','HR'],
     	['PURCHASE WF', 'PROCESS WF']
       ]).oneTime()
       .extra() 
	)
    // because of all projects have same form we set all callback values same
		bot.hears('CAMIS',(ctx)=>{callbackQuery.data='Create_issue_Form'})
		bot.hears('NRALIS',(ctx)=>{callbackQuery.data='Create_issue_Form'})
		bot.hears('WISI',(ctx)=>{callbackQuery.data='Create_issue_Form'})
		bot.hears('DAMS',(ctx)=>{callbackQuery.data='Create_issue_Form'})
		bot.hears('HR',(ctx)=>{callbackQuery.data='Create_issue_Form'})
		bot.hears('PURCHASE WF',(ctx)=>{callbackQuery.data='Create_issue_Form'})
		bot.hears('PROCESS WF',(ctx)=>{callbackQuery.data='Create_issue_Form'})
}
//getting Project Category  
const superWizard = new WizardScene('Create_issue_Form',
  (ctx) => {
  	ctx.wizard.state.Project=ctx.message.text
    ctx.reply('Please Insert Issue Title')
    return ctx.wizard.next()
  },
  (ctx) => {
//getting Issue title
  	ctx.wizard.state.Issue_title = ctx.message.text
    ctx.reply('Please Insert Issue Description')
    return ctx.wizard.next()
  },
  (ctx) => {
//getting Issue description
  	ctx.wizard.state.Issue_description = ctx.message.text
    ctx.reply('Please Insert Issue Eniviroment (Loation)')
    return ctx.wizard.next()
  },
  (ctx) => {
    //getting Issue description
        ctx.wizard.state.Issue_enviroment = ctx.message.text
        ctx.reply('Please Choose Issue Priority',Markup.inlineKeyboard([
          Markup.callbackButton('Low','Low'),
          Markup.callbackButton('Medium','Medium'),
          Markup.callbackButton('High','High')
        ]).extra())

        bot.on("callback_query",(ctx)=>{
          var data=ctx.callbackQuery.data
        })
        return ctx.wizard.next()
      },
  (ctx) => {
//getting Issue Enviroment
    ctx.wizard.state.Issue_priority = ctx.callbackQuery.data
    ctx.reply('Please Insert Issue Screen-shot')
    return ctx.wizard.next()
  },
  (ctx) => {
  	var picture = ctx.message.photo[1].file_id//getting photo file_id 'photo[1]'=>its resolution type 0-3 low to high    
    var Issue_name = ctx.wizard.state.Issue_title
    var Issue_description = ctx.wizard.state.Issue_description
    var Issue_enviroment = ctx.wizard.state.Issue_enviroment
    var Project = ctx.wizard.state.Project
    var id = Project.substring(0,2)
    var user_name = ctx.from.username
    var priority = ctx.wizard.state.Issue_priority

    Issue_info=[picture,Issue_name,Issue_description,Issue_enviroment,Project,id,user_name,priority,ctx]
	
   ctx.reply(`Are You want to Report This Issue\n
   Project Category : ${Project}\n
   Issue Name : ${Issue_name}\n 
   Issue Description : ${Issue_description}\n
   Issue Enviroment : ${Issue_enviroment}\n
   Issue Priority : ${priority}\n`,Markup.inlineKeyboard([
   	Markup.callbackButton('submit','submit'),
   	Markup.callbackButton('cancel','cancel')]).extra())
     return ctx.scene.leave() 
   })
     bot.action('submit',(ctx)=>{
       DBhandler.getting_Issue_id(Issue_info[0],Issue_info[1],Issue_info[2],Issue_info[3],Issue_info[4],Issue_info[5],Issue_info[6],Issue_info[7],Issue_info[8])
      })
     bot.action('cancel',(ctx)=>{
      ctx.reply("Issue Is Canceled")
     })
      exports.displaying_issue_id = (id,ctx)=>{
       ctx.reply(`Issue Is reported successfully \n to Track you Issue Use This \n ${id} Issue ID`)
      }

const stage = new Stage([superWizard], { default: 'Create_issue_Form' })
bot.use(session())
bot.use(stage.middleware())

bot.startPolling()

