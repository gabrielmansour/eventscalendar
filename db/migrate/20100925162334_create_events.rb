class CreateEvents < ActiveRecord::Migration
  def self.up
    create_table :events, :force => true do |t|
      t.column :summary, :string
      t.column :dtstart, :datetime
      t.column :dtend, :datetime
      t.column :description, :text
      t.column :url, :text
      t.column :ticket_url, :text
      t.column :creator_id, :integer
    end
  end

  def self.down
    drop_table :events
  end
end
