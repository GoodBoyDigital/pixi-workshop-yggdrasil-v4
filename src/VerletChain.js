
var VerletChain = function()
{
	this.startX = 0;
	this.startY = 0;
	this.gravity = 1.4;

	var endX = 0;
	var endY = 400;

	var gravity = 0//9.8;
	var wind = 0;

	// Stick properties
	var joints = 20;
	var linkLength2 = 10 * 3 * 1.5;

	// World params
	var pm = 1000; // Pixels/meter
	var dt = 1 /60;

	// Position Arrays
	// Current posiitions
	var pX = [];
	var pY = [];
	// Old positions for verlet integration
	var oX = [];
	var oY = [];

	this.links = [];

	this.build = function (size)
	{
		linkLength2 = size / joints
		dt = 1 / 10;

		var offsetX = 0//(endX - this.startX) / joints;
		var offsetY = -linkLength2//(endY - this.startY) / joints;

		var i;
		for (i = 0;i <= joints;i++)
		{
			pX[i] = this.startX + (offsetX * i) + i;
			pY[i] = this.startY + (offsetY * i);

			oX[i] = this.startX + (offsetX * i);
			oY[i] = this.startY + (offsetY * i);

			this.links[i] = new PIXI.Point(i * 20, i * 20);//new Segment();
			//addChild(links[i]);
		}

	//	update();
	}

	this.update = function (ball)
	{
		pX[0] = this.startX;
		pY[0] = this.startY;

	//	console.log(this.startX)
		//pX[joints] = endX;
		//pY[joints] = endY;

		this.verlet();

		this.satisfyConstraints();
	//	if(ball)this.detect(ball);
		this.satisfyJoints();
	}

	this.satisfyJoints = function satisfyJoints()
	{
		var link;


		for (var i = 0;i <= joints; i++) {

			this.links[i].x = pX[i];
			this.links[i].y = pY[i];
		//	this.graphics.lineTo(pX[i], pY[i]);
			//this.graphics.drawCircle(pX[i], pY[i], 3);
			//this.graphics.moveTo(pX[i], pY[i]);
		}

//		this.graphics.lineTo(endX, endY);
	}

	this.detect = function(ball)
	{
		var link;
		var radius = 150//ball.radius;
		//console.log(ball)
		for (var i = 2;i < joints-1;i++)
		{
			link = this.links[i];

			var dx = ball.x - pX[i];
			var dy = ball.y - pY[i];

			var dist = Math.sqrt(dx * dx + dy * dy);

			if(dist < radius)
			{
				//trace(dx);
				// push it out init!
				var normalX = -dx / dist;
				var normalY = -dy / dist;

				pX[i] = oX[i] = ball.x + (normalX * radius);
				pY[i] = oY[i] =  ball.y + (normalY * radius);


			}
		}
	}

	this.getAngle = function(x1, y1, x2, y2)
	{
		var dx = x1 - x2;
		var dy = y1 - y2;

		return Math.atan2(dy, dx);
	}

	this.verlet = function()
	{
		for (var i = 0;i <= joints;i++)
		{
			var tempX = pX[i];
			var tempY = pY[i];

			var friction = 0.96;

			pX[i] += 1 * (friction * pX[i] - friction * oX[i])//+ (wind * pm * dt * dt);
			pY[i] += 1 * (friction * pY[i] - friction * oY[i]) + this.gravity //+ (gravity * pm * dt * dt);

			oX[i] = tempX;
			oY[i] = tempY;
		}
	}

	this.satisfyConstraints = function()
	{
		//for (var j = 1;j <= joints;j++)
		{
			for (var i = 1;i <= joints;i++)
			{
				var dx = (pX[i] - pX[i - 1]);
				var dy = (pY[i] - pY[i - 1]);
				var dist = Math.sqrt((dx * dx) + (dy * dy));


				var diff = dist - linkLength2;

				var offsetX = (diff * dx / dist) / 2;
				var offsetY = (diff * dy / dist) / 2;

				pX[i] -= offsetX;
				pY[i] -= offsetY;
				pX[i - 1] += offsetX;
				pY[i - 1] += offsetY;
				/*
				// satisfy angle??
				if(i < joints )
				{

					var dx = (pX[i + 1] - pX[i - 1]);
					var dy = (pY[i + 1] - pY[i - 1]);
					var dist = Math.sqrt((dx * dx) + (dy * dy));

					var constraint = linkLength2 * 2;

					if(dist < constraint)
					{
						var diff = dist - (constraint);
						var offsetX = (diff * dx / dist) / 2;
						var offsetY = (diff * dy / dist) / 2;

						pX[i + 1] -= offsetX;
						pY[i + 1] -= offsetY;
						pX[i - 1] += offsetX;
						pY[i - 1] += offsetY;
					}
				}*/
			//	if(dy < 0)
			//	{

			//	}
			}
		}
	}

	this.reset = function(left)
	{
		//alert(joints);
		var size = 250;

		linkLength2 = size / joints
		dt = 1 / 10;

		console.log(left)
		var offsetX = left ? 20 : -20//(endX - this.startX) / joints;
		var offsetY = -linkLength2//(endY - this.startY) / joints;

		var i;
		for (i = 0;i <= joints;i++)
		{
			pX[i] = this.startX + (offsetX * i) + i;
			pY[i] = this.startY + (offsetY * i);

			oX[i] = this.startX + (offsetX * i);
			oY[i] = this.startY + (offsetY * i);

		//	this.links[i] = new PIXI.Point(i * 20, i * 20);//new Segment();
			//addChild(links[i]);
		}
	}



	this.destroy = function()
	{
		pX = null;
		pY = null;

		oX = null;
		oY = null;

		links = null;
	}

	this.setLength = function(length, reset)
	{
		length *= 0.8;
		var distX = endX - this.startX;
		var distY = endY - this.startY;
		distX /= joints;
		distY /= joints;

		linkLength2 = length / joints;

		if(reset)
		{
			for (var i = 0; i < joints; i++)
			{
				pX[i] = oX[i] = this.startX + distX * i;
				pY[i] = oY[i] = this.startY + distY * i;
			}

		}
	}
}

export default VerletChain