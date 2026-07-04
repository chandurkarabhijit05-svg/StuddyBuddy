export default function FeatureCard({title,desc}){

return(

<div className="glass p-8">

<h2 className="text-2xl font-bold mb-4">
{title}
</h2>

<p className="text-gray-400">
{desc}
</p>

</div>

)

}